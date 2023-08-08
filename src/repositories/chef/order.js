import { level, logger } from '../../config/logger';

import orderModel from '../../models/order';
import refundModel from '../../models/refund';

import * as orderPipeline from '../../aggregate_pipeline/chef/order';
import * as utilityFunctions from '../../utils/utility';
import * as stripeService from '../../services/stripe/stripe';

import { Mapping } from '../../services/database/database_schema_operation';
import chefTimeSlotModel from '../../models/chef_time_slot';
import user from '../../models/user';

import { constants as SENDGRID_CONST } from '../../constant/sendgrid';
import { constants as APP_CONST } from '../../constant/application';
import sendGrid from '../../utils/sendgrid';
import chefModel from '../../models/chef';

export const orderList = async (chef_id, options) => {
  logger.log(level.info, `>> orderList()`);

  let orderDoc = await orderModel.aggregate(
    orderPipeline.getPipelineForOrderList(chef_id, options)
  );
  let countPipeline = orderPipeline.getPipelineForOrderList(chef_id, {}, true);

  let count = await utilityFunctions.getCountPipeline(
    orderModel,
    orderDoc,
    countPipeline
  );
  let data = {
    message: 'succ_152',
    count,
    data: orderDoc,
  };
  return data;
};

export const orderDetails = async (chef_id, order_number) => {
  logger.log(level.info, `>> orderDetails()`);

  let [orderData] = await orderModel.aggregate(
    orderPipeline.getPipelineForOrderDetails(chef_id, order_number)
  );
  let data = {
    message: 'succ_156',
    data: orderData,
  };
  return data;
};

export const orderRefundList = async (chef_id, options) => {
  logger.log(level.info, `>> orderRefundList()`);

  let refundDoc = await refundModel.aggregate(
    orderPipeline.getRefundOrderList(chef_id, options)
  );
  refundDoc = Mapping(refundDoc);
  let countPipeline = orderPipeline.getRefundOrderList(chef_id, {}, true);

  let count = await utilityFunctions.getCountPipeline(
    refundModel,
    refundDoc,
    countPipeline
  );

  let data = {
    message: 'succ_154',
    count,
    data: refundDoc,
  };
  return data;
};

export const orderRefundDetails = async (chef_id, refund_id) => {
  logger.log(level.info, `>> orderRefundDetails()`);
  let refundData = await refundModel.aggregate(
    orderPipeline.getRefundOrderDetails(chef_id, refund_id)
  );
  refundData = Mapping(refundData);

  let data = {
    message: 'succ_154',
    data: refundData[0],
  };
  return data;
};

export const editOrderStatus = async (chef_id, order_number, status) => {
  logger.log(level.info, `>> editOrderStatus()`);
  let validStatus = [2, 3, 4, 5];
  let data = {};

  if (!validStatus.includes(status)) {
    data = {
      error: true,
      message: 'err_158',
    };
    return data;
  }

  let orderFilters = editOrderFilters(chef_id, order_number);
  let orderData = await orderModel.get(orderFilters.getOrderData);
  if (!orderData || orderData.length <= 0) {
    data = {
      error: true,
      message: 'err_157',
    };
    return data;
  }
  orderData = orderData[0];
  data = updateStatus(orderData, orderFilters, status);
  return data;
};

const editOrderFilters = (chef_id, order_number) => {
  logger.log(level.info, `>> editOrderFilters()`);
  let getOrderData = {
    chef_id,
    order_number,
    refunded: false,
    $or: [{ status: 1 }, { status: 2 }, { status: 3 }],
  };

  let updateOrder = { $or: [{ status: 3 }], order_number };

  return { getOrderData, updateOrder };
};

const updateStatus = async (orderData, orderFilters, status) => {
  logger.log(level.info, `>> updateStatus()`);

  let data = {};
  // ? If order status is 1:Created then chef can change it to 2: Pending
  if (orderData.status === 1 && status === 2) {
    await orderModel.update(
      { order_number: orderData.order_number },
      { $set: { status } }
    );
    data = {
      error: false,
      message: 'succ_157',
    };
    return data;
  }

  // ? If order status is 1:Created or 2: Pending then chef can change it to 3:Approve
  if ((orderData.status === 1 || orderData.status === 2) && status === 3) {
    await Promise.all([
      orderModel.update(
        { order_number: orderData.order_number },
        { $set: { status } }
      ),
      chefTimeSlotModel.update(
        {
          chef_id: orderData.chef_id,
          'not_working_dates.booked_dates': {
            $elemMatch: {
              user_id: orderData.user_id,
            },
          },
        },
        {
          $set: {
            'not_working_dates.booked_dates.$.status': status,
          },
        }
      ),
      sendApprovalMail(orderData),
    ]);
    data = {
      error: false,
      message: 'succ_157',
    };
    return data;
  }
  if (orderData.status === 3 && status === 5) {
    await Promise.all([
      orderModel.update(orderFilters.updateOrder, { $set: { status } }),
      chefTimeSlotModel.update(
        {
          chef_id: orderData.chef_id,
          'not_working_dates.booked_dates': {
            $elemMatch: {
              user_id: orderData.user_id,
            },
          },
        },
        {
          $set: {
            'not_working_dates.booked_dates.$.status': status,
          },
        }
      ),
    ]);
    data = {
      error: false,
      message: 'succ_157',
    };
    return data;
  }

  // ? If order status is 1:Created or 2: Pending then chef can change it to 4:Rejected
  // ? And also refund the amount
  if ((orderData.status === 1 || orderData.status === 2) && status === 4) {
    let refundData = refundDataJson(orderData);
    let rejectedResult = await orderRejected(orderData, refundData, status);
    if (rejectedResult) {
      data = {
        error: false,
        message: 'succ_157',
      };
      return data;
    }
  }
};

const refundDataJson = (orderData) => {
  logger.log(level.info, `>> refundDataJson()`);
  let { total_amount, amount_discount, user_id, chef_id, order_number } =
    orderData;
  let addRefundDoc = {
    total_amount: Number(total_amount),
    discount_amount: Number(amount_discount),
    user_id,
    order_number,
    chef_id,
  };
  return addRefundDoc;
};

const orderRejected = async (orderData, refundData, status) => {
  logger.log(level.info, `>> orderRejected()`);

  let { payment_intent, total_amount, chef_id, order_number, portfolios } =
    orderData;

  await Promise.all([
    // ? Stripe Refund
    stripeService.createRefund(payment_intent, Number(total_amount)),
    // ? Remove time slot from chef side and change portfolios status
    updateOrderData(portfolios, chef_id, order_number, status),
    // ? Send Mail of order Rejected
    sendOrderRejectedMail(orderData),
    // ? Add refund data in database
    refundModel.add(refundData),
  ]);
  return true;
};

const updateOrderData = async (portfolios, chef_id, order_number, status) => {
  logger.log(level.info, `>> updateOrderData()`);
  portfolios.map(async (bookedDate) => {
    await chefTimeSlotModel.update(
      { chef_id },
      {
        $pull: {
          'not_working_dates.booked_dates': {
            portfolio_id: bookedDate.portfolio_id,
          },
        },
      }
    );
  });
  await orderModel.update(
    { order_number, $or: [{ status: 1 }, { status: 2 }] },
    { $set: { status } }
  );

  return true;
};

const sendApprovalMail = async (orderData) => {
  let [userData] = await user.get({ user_id: orderData.user_id });
  logger.log(level.info, `>> sendApprovalMail()`);
  const message = {
    to: userData.email,
    from: SENDGRID_CONST.SENDGRID_FROM,
    templateId: SENDGRID_CONST.ORDER_APPROVAL,
    dynamic_template_data: {
      NAME: userData.firstname,
      LOGO: APP_CONST.LOGO_URL,
      ORDER_NUMBER: orderData.order_number,
    },
  };
  sendGrid(message);
};

const sendOrderRejectedMail = async (orderData) => {
  logger.log(level.info, `>> sendOrderRejectedMail()`);
  let [[userData], [chefData]] = await Promise.all([
    user.get({ user_id: orderData.user_id }),
    chefModel.get({ chef_id: orderData.chef_id }),
  ]);
  const message = {
    to: userData.email,
    from: SENDGRID_CONST.SENDGRID_FROM,
    templateId: SENDGRID_CONST.ORDER_REJECTED,
    dynamic_template_data: {
      NAME: userData.firstname,
      CHEF_EMAIL: chefData.email,
      LOGO: APP_CONST.LOGO_URL,
      ORDER_NUMBER: orderData.order_number,
    },
  };
  sendGrid(message);
};
