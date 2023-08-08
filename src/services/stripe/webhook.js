import { level, logger } from '../../config/logger';
import * as stripeService from './stripe';
import { constants as APP_CONST } from '../../constant/application';
import { serverError } from '../../utils/utility';
import orderModel from '../../models/order';
import user from '../../models/user';
import cartModel from '../../models/cart';
import uniqid from 'uniqid';
import portfolioModel from '../../models/portfolio';
import chefTimeSlotModel from '../../models/chef_time_slot';

export const webhook = async (req, res) => {
  logger.log(level.debug, `>> webhook()`);
  const signature = req.headers['stripe-signature'];

  const event = stripeService.constructEvent(
    req.body,
    signature,
    APP_CONST.WEBHOOK_CHARGE_SECRET_KEY
  );
  try {
    logger.log(level.info, `>> webhook()`);
    switch (event.type) {
      case 'charge.succeeded':
        await chargeSucceeded(event.data.object);
        break;
      case 'charge.refunded':
        await refundAmount(event.data.object);
        break;
      case 'checkout.session.completed':
        await sessionCompleted(event.data.object);
        break;
      case 'checkout.session.async_payment_failed':
        await paymentFailed(event.data.object);
        break;
      default:
        return res.status(400).end();
    }
    res.json({ received: true });
  } catch (error) {
    logger.log(level.error, `<< webhook() error=${error}`);
    serverError(res);
  }
};

const chargeSucceeded = async (paymentMethod) => {
  logger.log(level.info, `>> chargeSucceeded()`);
  const {
    id,
    amount,
    application_fee_amount,
    billing_details,
    shipping,
    captured,
    payment_intent,
    receipt_url,
    refunded,
    balance_transaction,
  } = paymentMethod;

  try {
    let [userData] = await user.get({ email: billing_details.email });

    let [cartData] = await cartModel.get({ user_id: userData.user_id });

    let portfoliosArr = [];
    let bookedDate = [];
    let [portfolioPromiseData] = await Promise.all(
      cartData.ordersPortfolio.portfolios.map(async (portfolioData) => {
        let portfolioJsonData = await portfolioDetails(portfolioData);
        bookedDate.push({
          meeting_status: 1,
          user_id: userData.user_id,
          portfolio_id: portfolioJsonData.portfolio_id,
          date: portfolioJsonData.date,
          people: portfolioJsonData.people,
        });
        portfoliosArr.push(portfolioJsonData);
        return { portfoliosArr, bookedDate };
      })
    );

    let cartJSONData = {};
    let ordersPortfolio = {};
    ordersPortfolio.chef_id = cartData.ordersPortfolio.chef_id;
    ordersPortfolio.portfolios = portfolioPromiseData.portfoliosArr;

    cartJSONData.cart_id = cartData.cart_id;
    cartJSONData.user_id = cartData.user_id;
    cartJSONData.ordersPortfolio = ordersPortfolio;

    let orderData = {
      charge_id: id,
      status: 1,
      payment_intent,
      user_id: userData.user_id,
      refunded,
      chef_id: cartData.ordersPortfolio.chef_id,
      shipping_address: shipping,
      order_number: uniqid(),
      billing_address: billing_details,
      total_amount: amount / 100,
      user_email: billing_details.email,
      user_phone_number: userData.phone_number,
      portfolios: cartJSONData.ordersPortfolio.portfolios,
      receipt_url,
      captured,
      balance_transaction,
      application_fee_amount: application_fee_amount / 100,
      amount_discount: payment_intent.amount_discount,
    };
    // ! Send Mail to user and chef
    await Promise.all([
      chefTimeSlotModel.update(
        { chef_id: cartData.ordersPortfolio.chef_id },
        {
          $addToSet: {
            'not_working_dates.booked_dates': {
              $each: portfolioPromiseData.bookedDate,
            },
          },
        }
      ),
      orderModel.add(orderData),
      cartModel.delete({ user_id: userData.user_id }),
    ]);
  } catch (error) {
    logger.log(level.error, `<< chargeSucceeded() error=${error}`);
  }
};

const portfolioDetails = async (portfolioData) => {
  logger.log(level.info, `>> portfolioDetails()`);
  let portfolioJson = {};
  let [portfolioDoc] = await portfolioModel.get(
    { portfolio_id: portfolioData.portfolio_id },
    {
      _id: 0,
      portfolio_id: 1,
      portfolio_name: 1,
      images: 1,
      amount: { $elemMatch: { people: portfolioData.people } },
    }
  );
  portfolioJson = {
    date: portfolioData.date,
    images: portfolioDoc.images,
    portfolio_name: portfolioDoc.portfolio_name,
    portfolio_id: portfolioDoc.portfolio_id,
    amount: portfolioDoc.amount[0].price,
    people: portfolioDoc.amount[0].people,
    meeting_status: 1,
  };
  return portfolioJson;
};

const refundAmount = async (refundMethod) => {
  logger.log(level.info, `>> refundAmount()`);
  let { payment_intent, receipt_url, status } = refundMethod;
  let filterOrder = { payment_intent };
  let updateData = {
    refunded: true,
    refund_invoice_url: receipt_url,
  };
  try {
    if (status === 'succeeded') {
      await orderModel.update(filterOrder, {
        $set: updateData,
      });

      logger.log(level.info, `>> refundAmount() refund data updated`);
    } else {
      logger.log(
        level.info,
        `>> refundAmount() There is error during refund initiative`
      );
    }
  } catch (error) {
    logger.log(level.error, `<< refundAmount() error=${error}`);
  }
};

const sessionCompleted = async (checkoutMethod) => {
  logger.log(level.info, `>> sessionCompleted()`);
  let { total_details, payment_intent } = checkoutMethod;
  try {
    if (total_details && total_details.amount_discount) {
      let amount_discount = total_details.amount_discount / 100;
      setTimeout(
        async () =>
          await orderModel.update(
            { payment_intent },
            { $set: { amount_discount } }
          ),
        7000
      );

      logger.log(
        level.info,
        `>> sessionCompleted() discount amount added successfully`
      );
    }
  } catch (error) {
    logger.log(level.error, `<< sessionCompleted() error=${error}`);
  }
};

const paymentFailed = async (failedPayment) => {
  try {
    logger.log(level.info, `>> paymentFailed() ${failedPayment}`);
  } catch (error) {
    logger.log(level.error, `<< paymentFailed() error=${error}`);
  }
};
