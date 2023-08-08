import { level, logger } from '../../config/logger';

import cartModel from '../../models/cart';
import chefModel from '../../models/chef';
import configModel from '../../models/config';
import couponModel from '../../models/coupon';
import portfolioModel from '../../models/portfolio';
import orderModel from '../../models/order';
import user from '../../models/user';
import refundModel from '../../models/refund';
import chefTimeSlotModel from '../../models/chef_time_slot';

import * as stripeService from '../../services/stripe/stripe';
import * as orderPipeline from '../../aggregate_pipeline/user/order';
import * as utilityFunctions from '../../utils/utility';
import { Mapping } from '../../services/database/database_schema_operation';
import moment from 'moment';
import * as portfolioPipeline from '../../aggregate_pipeline/user/portfolio';

export const getCheckoutSession = async (user_id) => {
  logger.log(level.info, `>> getCheckoutSession()`);

  let [[cartData], [userData]] = await Promise.all([
    cartModel.aggregate(orderPipeline.getPipelineForCouponData(user_id)),
    user.get({ user_id, status: 1 }),
  ]);

  let [chefData] = await chefModel.get({
    chef_id: cartData.ordersPortfolio.chef_id,
  });

  // ? Get ordered Portfolio list for stripe
  const { line_items, total_amount } = await stripeLineItems(cartData);
  let coupon_code = cartData.coupon_code;

  if (coupon_code) {
    let isCouponValid = await checkCouponStatus(coupon_code);
    if (!isCouponValid) {
      await cartModel.update({ user_id }, { $unset: { coupon_code: '' } });
      coupon_code = undefined;
    }
  }
  let couponData;

  if (coupon_code) {
    couponData = cartData.couponData[0];
  }

  // ? Calculate Application Fee
  let applicationFee = await getApplicationFees(total_amount, couponData);

  // ? Get Stripe Session id
  const session = await stripeService.checkoutSession(
    user_id,
    userData.email,
    line_items,
    chefData.stripe_user_id,
    applicationFee,
    coupon_code,
    cartData.ordersPortfolio
  );

  if (session.error) {
    return session;
  }

  if (cartData.coupon_code) {
    await cartModel.update({ user_id }, { $unset: { coupon_code: '' } });
    coupon_code = undefined;
  }

  let data = {
    message: 'succ_151',
    data: session.data.id,
  };
  return data;
};

const checkCouponStatus = async (coupon_code) => {
  logger.log(level.info, `>> checkCouponStatus()`);
  let [stripeCouponData, couponData] = await Promise.all([
    stripeService.couponRetrieveForCart(coupon_code),
    couponModel.get({ coupon_code, status: 1 }),
  ]);

  couponData = couponData[0];
  if (!stripeCouponData || !couponData || couponData.length <= 0) {
    return false;
  }

  return true;
};

const stripeLineItems = async (cartData) => {
  logger.log(level.info, `>> stripeLineItems()`);
  const { ordersPortfolio } = cartData;
  const { portfolios } = ordersPortfolio;
  let line_items = [];
  let total_amount = 0;
  let unit_amount = 0;

  await Promise.all(
    portfolios.map(async (portfolio) => {
      let [portfolioData] = await portfolioModel.get(
        { portfolio_id: portfolio.portfolio_id },
        {
          _id: 0,
          amount: { $elemMatch: { people: portfolio.people } },
          images: 1,
          portfolio_name: 1,
          description: 1,
        }
      );

      unit_amount = portfolioData.amount[0].price * 100;

      let line_item_obj = {
        quantity: 1,
        price_data: {
          product_data: {
            images: portfolioData.images,
            name: portfolioData.portfolio_name,
            description: portfolioData.description,
          },
          currency: 'usd',
          unit_amount,
        },
      };
      line_items.push(line_item_obj);
      total_amount += unit_amount / 100;
    })
  );

  let data = {
    line_items,
    total_amount,
  };
  return data;
};

const getApplicationFees = async (total_amount, couponData) => {
  logger.log(level.info, `>> getApplicationFees()`);
  let order_application_fee;
  const [configDoc] = await configModel.get({});
  let { application_fee } = configDoc;

  if (couponData) {
    if (couponData && couponData.percent_off) {
      let discount_amount = total_amount * (couponData.percent_off / 100);
      total_amount -= discount_amount;
      order_application_fee = total_amount * application_fee;
    }

    if (couponData && couponData.amount_off) {
      let discount_amount = couponData.amount_off / 100;
      total_amount -= discount_amount;
      order_application_fee = total_amount * application_fee;
    }
    return Math.round(order_application_fee);
  }

  order_application_fee = total_amount * application_fee;
  return Math.round(order_application_fee);
};

export const getOrderList = async (user_id, options) => {
  logger.log(level.debug, `>> getOrderList()`);
  let orderList = await orderModel.aggregate(
    orderPipeline.getPipelineForOrderDetails(user_id, options)
  );

  orderList = Mapping(orderList);
  let countPipeline = orderPipeline.getPipelineForOrderDetails(
    user_id,
    {},
    true
  );

  let count = await utilityFunctions.getCountPipeline(
    orderModel,
    orderList,
    countPipeline
  );

  let data = {
    message: 'succ_152',
    count,
    data: orderList,
  };
  return data;
};

export const orderDetails = async (user_id, order_number) => {
  logger.log(level.info, `>> orderDetails()`);

  let [orderData] = await orderModel.aggregate(
    orderPipeline.getPipelineForOrder(user_id, order_number)
  );
  let data = {
    message: 'succ_156',
    data: orderData,
  };
  return data;
};

export const cancelOrder = async (user_id, order_number) => {
  logger.log(level.info, `>> cancelOrder()`);
  let data = {};
  let filters = cancelOrderFilter(user_id, order_number);
  let orderData = await orderModel.get(filters.orderFilter);
  if (!orderData || orderData.length <= 0) {
    data = {
      error: true,
      message: 'err_152',
    };
    return data;
  }
  filters = cancelOrderFilter(user_id, order_number, orderData);

  orderData = orderData[0];
  let { portfolios, payment_intent, total_amount, chef_id } = orderData;
  let today = new Date();
  let addDays = moment(today).add(2, 'days');
  let todayDate = moment(addDays).format('YYYY-MM-DD');

  portfolios.map((bookedDate) => {
    if (todayDate > bookedDate.date) {
      data = {
        error: true,
        message: 'err_151',
      };
      return data;
    }
  });

  await Promise.all([
    // ? Stripe Refund
    stripeService.createRefund(payment_intent, Number(total_amount)),
    // ? Remove time slot from chef side and change portfolios status
    updateOrderData(portfolios, chef_id, order_number),
    // ? Add refund data in database
    refundModel.add(filters.addRefundData),
  ]);
  data = {
    error: false,
    message: 'succ_153',
  };
  return data;
};

const cancelOrderFilter = (user_id, order_number, orderData) => {
  logger.log(level.info, `>> cancelOrderFilter()`);
  let orderFilter = {
    user_id,
    order_number,
    refunded: false,
    $or: [{ status: 1 }, { status: 2 }, { status: 3 }],
  };

  if (orderData) {
    orderData = orderData[0];
    let { total_amount, amount_discount } = orderData;

    let addRefundData = {
      total_amount: Number(total_amount),
      discount_amount: Number(amount_discount),
      user_id,
      order_number,
      chef_id: orderData.chef_id,
    };
    return { addRefundData };
  }
  return { orderFilter };
};

const updateOrderData = async (portfolios, chef_id, order_number) => {
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

    orderModel.updateMany(
      {
        portfolios: { $elemMatch: { meeting_status: 1 } },
        order_number,
      },
      { $set: { 'portfolios.$.meeting_status': 7, status: 7 } },
      { multi: true }
    );
  });
  return true;
};

export const orderRefundList = async (user_id, options) => {
  logger.log(level.info, `>> orderRefundList()`);
  let [refundList, count] = await Promise.all([
    refundModel.get({ user_id }, '', options),
    refundModel.count({ user_id }),
  ]);
  let data = {
    message: 'succ_154',
    count,
    data: refundList,
  };
  return data;
};

export const orderRefundDetails = async (user_id, refund_id) => {
  logger.log(level.info, `>> orderRefundDetails()`);
  let data = {};
  let refundData = await refundModel.aggregate(
    orderPipeline.getRefundDataPipeline(user_id, refund_id)
  );

  data = {
    message: 'succ_155',
    data: refundData[0],
  };
  return data;
};

export const upcomingMeeting = async (user_id, options) => {
  logger.log(level.info, `>> upcomingMeeting()`);

  const todayDate = moment().format('YYYY-MM-DD');
  let data = {};
  const filterMeet = {
    user_id: user_id,
    'portfolios.date': { $gte: todayDate },
  };

  let orderData = await orderModel.aggregate(
    portfolioPipeline.pipelineForUpcomingMeeting(filterMeet, options)
  );

  let countPipeline = portfolioPipeline.pipelineForUpcomingMeeting(
    filterMeet,
    {},
    true
  );

  let count = await utilityFunctions.getCountPipeline(
    orderModel,
    orderData,
    countPipeline
  );
  if (orderData && orderData.length > 0) {
    data = {
      message: 'succ_152',
      count,
      data: orderData,
    };
  } else {
    data = {
      message: 'succ_152',
      count: 0,
      data: [],
    };
  }
  return data;
};
