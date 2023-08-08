import { stripe } from '../../config/stripe';
import { logger, level } from '../../config/logger';
import { constants as APP_CONST } from '../../constant/application';
import { unavailableDates } from '../../repositories/user/portfolio';
import moment from 'moment';
// import { constants as STRIPE_CONST } from '../../constant/stripe';

const PATH = {
  REDIRECT_TO_STORE_DASHBOARD: APP_CONST.CHEF_UI_URL + '/chef/dashboard',
};

export const chargeChef = async (data) => {
  return new Promise((resolve, reject) => {
    stripe.charges.create(
      {
        amount: data.amount,
        currency: data.currency,
        source: data.source,
        receipt_email: data.receipt_email,
        description: data.description,
        shipping: {
          name: data.card_holder_name,
          address: {
            line1: data.address_line1,
            postal_code: data.address_zip,
            city: data.address_city,
            state: data.address_state,
            country: data.address_country,
          },
        },
      },
      (err, chargeResp) => {
        if (err) {
          return reject(err);
        }
        return resolve(chargeResp);
      }
    );
  });
};

export const constructEvent = (body, signature, key) => {
  return stripe.webhooks.constructEvent(body, signature, key);
};

export const checkoutSession = async (
  customer_id,
  customer_email,
  products,
  stripe_user_id,
  application_fee,
  coupon,
  ordersPortfolio
) => {
  logger.log(level.info, `>> checkoutSession()`);

  let chefUnavailableDates = await unavailableDates(ordersPortfolio.chef_id);
  let isError;
  let data = {};

  // ? If User came after some days (cart is exist) then check if the date is still free
  ordersPortfolio.portfolios.map((cartDate) => {
    let day = moment(cartDate.date).format('dddd').toLowerCase();

    if (
      chefUnavailableDates.dates.includes(cartDate.date) ||
      !chefUnavailableDates.weekDays.includes(day)
    ) {
      isError = true;
      return isError;
    }
    isError = false;
    return isError;
  });

  if (isError) {
    data = {
      error: true,
      message: 'err_113',
    };
    return data;
  }

  let stripeCheckoutJSON = {
    payment_method_types: APP_CONST.PAYMENT_METHODS,
    billing_address_collection: 'required',
    shipping_address_collection: {
      allowed_countries: APP_CONST.ALLOWED_COUNTRIES,
    },
    success_url: APP_CONST.END_USER_URL,
    cancel_url: APP_CONST.END_USER_URL,
    customer_email: customer_email,
    mode: APP_CONST.MODE,
    line_items: products,
    client_reference_id: customer_id,
    payment_intent_data: {
      application_fee_amount: application_fee,
      transfer_data: {
        destination: stripe_user_id,
      },
      on_behalf_of: stripe_user_id,
    },
  };

  if (coupon) {
    stripeCheckoutJSON.discounts = [{ coupon }];
  }

  const session = await stripe.checkout.sessions.create(stripeCheckoutJSON);
  data = {
    error: false,
    data: session,
  };
  return data;
};

export const oauthToken = async (code) => {
  const response = await stripe.oauth.token({
    grant_type: 'authorization_code',
    code,
    assert_capabilities: ['transfers'],
  });

  return response;
};

// /users-store/dashboard
export const createLoginLink = async (stripe_user_id) => {
  const loginLink = await stripe.accounts.createLoginLink(stripe_user_id, {
    redirect_url: PATH.REDIRECT_TO_STORE_DASHBOARD,
  });

  return loginLink;
};

// Fetch the account balance to determine the available funds
export const balanceRetrieve = async (stripe_user_id) => {
  const balance = await stripe.balance.retrieve({
    stripeAccount: stripe_user_id,
  });

  return balance;
};

export const payoutCreate = async (stripe_user_id, amount, currency) => {
  const payout = await stripe.payouts.create(
    {
      amount: amount,
      currency: currency,
      statement_descriptor: 'Weed Find',
    },
    {
      stripeAccount: stripe_user_id,
    }
  );
  return payout;
};

export const createRefund = async (payment_intent, amount) => {
  let refundData = {
    payment_intent: payment_intent,
    reverse_transfer: true,
  };

  if (amount) refundData.amount = amount * 100;
  const refund = await stripe.refunds.create(refundData);

  return refund;
};

export const createAccount = async (email, countryCode) => {
  const account = await stripe.accounts.create({
    type: APP_CONST.ACCOUNT_TYPE,
    country: countryCode,
    email: email,
    business_type: APP_CONST.BUSINESS_TYPE,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });
  return account;
};

export const generateAccountLink = async (accountID, _origin) => {
  return stripe.accountLinks
    .create({
      type: 'account_onboarding',
      account: accountID,
      refresh_url: `${APP_CONST.HOST_URL}/api/chef/stripe/refresh_token`,
      return_url: PATH.REDIRECT_TO_STORE_DASHBOARD,
    })
    .then((link) => link.url);
};

export const getApplicationFees = async (
  limit,
  ending_before,
  starting_after
) => {
  let applicationQuery = {
    limit,
  };

  if (ending_before) applicationQuery.ending_before = ending_before;
  if (starting_after) applicationQuery.starting_after = starting_after;

  const applicationFees = await stripe.applicationFees.list(applicationQuery);

  return applicationFees;
};

export const allTransactions = async (limit, ending_before, starting_after) => {
  let transactionQuery = {
    limit,
  };

  if (ending_before) transactionQuery.ending_before = ending_before;
  if (starting_after) transactionQuery.starting_after = starting_after;

  const transactions = await stripe.balanceTransactions.list(transactionQuery);

  return transactions;
};

export const retriveCharge = async (charge_id) => {
  const charge = await stripe.charges.retrieve(charge_id);
  return charge;
};

export const allPayments = async (limit, ending_before, starting_after) => {
  let paymentQuery = {
    limit,
  };

  if (ending_before) paymentQuery.ending_before = ending_before;
  if (starting_after) paymentQuery.starting_after = starting_after;

  const payments = await stripe.paymentIntents.list(paymentQuery);

  return payments;
};

export const allRefundList = async (limit, ending_before, starting_after) => {
  let refundQuery = {
    limit,
  };

  if (ending_before) refundQuery.ending_before = ending_before;
  if (starting_after) refundQuery.starting_after = starting_after;

  const refunds = await stripe.refunds.list(refundQuery);

  return refunds;
};

export const couponCreate = async (body) => {
  let { percent_off, name, max_redemptions, amount_off } = body;

  let couponObj = {
    duration: 'once',
    name,
    max_redemptions,
  };

  if (percent_off) couponObj = { ...couponObj, percent_off };
  if (amount_off)
    couponObj = { ...couponObj, amount_off: amount_off * 100, currency: 'USD' };

  const coupon = await stripe.coupons.create(couponObj);
  let couponData = {
    coupon_code: coupon.id,
    duration: coupon.duration,
    max_redemptions: coupon.max_redemptions,
    name: coupon.name,
    valid: coupon.valid,
  };

  if (coupon.percent_off !== null) couponData.percent_off = coupon.percent_off;
  if (coupon.amount_off !== null) couponData.amount_off = coupon.amount_off;
  if (coupon.currency !== null) couponData.currency = coupon.currency;
  return couponData;
};

export const couponRetrieve = async (couponCode) => {
  const coupon = await stripe.coupons.retrieve(couponCode);
  return coupon;
};

export const couponDelete = async (couponCode) => {
  const deleted = await stripe.coupons.del(couponCode);
  return deleted;
};

export const couponRetrieveForCart = async (couponCode) => {
  try {
    const coupon = await stripe.coupons.retrieve(couponCode);
    let valid = coupon.valid;
    return valid;
  } catch (err) {
    logger.log(
      level.error,
      `>> couponRetrieveForCart() coupon error ${JSON.stringify(err)} `
    );

    let valid = false;
    return valid;
  }
};
export const accountInfo = async (account_id) => {
  const account = await stripe.accounts.retrieve(account_id);
  return account;
};
