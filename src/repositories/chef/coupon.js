import { level, logger } from '../../config/logger';
import couponModel from '../../models/coupon';
import chefPurchasePlanModel from '../../models/package_purchase';
import * as stripeService from '../../services/stripe/stripe';

export const createCoupon = async (chef_id, body) => {
  logger.log(level.info, `>> createCoupon()`);
  let isEligible = await checkEligible(chef_id);

  // ? check errors
  if (isEligible) return isEligible;

  let coupon = await stripeService.couponCreate(body);
  const date = new Date(body.expired_at);

  let expired_at = new Date(
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  );

  coupon = { ...coupon, chef_id, expired_at };

  await couponModel.add(coupon);

  await chefPurchasePlanModel.update(
    { chef_id, status: 1 },
    { $inc: { remaining_coupon: -1 } }
  );

  let data = {
    error: false,
    message: 'succ_141',
    data: coupon,
  };
  return data;
};

const checkEligible = async (chef_id) => {
  let data = {};

  let activePackageData = await chefPurchasePlanModel.get({
    chef_id,
    status: 1,
  });

  // ? Check if user has any active package
  if (!activePackageData || activePackageData.length <= 0) {
    data = {
      error: true,
      message: 'err_51',
    };
    return data;
  }

  activePackageData = activePackageData[0];
  // ? Active package has > 0 remaining portfolio
  if (activePackageData.remaining_coupon <= 0) {
    data = {
      error: true,
      message: 'err_80',
    };
    return data;
  }
};

export const getCouponDetails = async (coupon) => {
  logger.log(level.info, `>> getCouponDetails()`);
  let couponData = await stripeService.couponRetrieve(coupon);

  let couponDetails = {
    coupon_code: couponData.id,
    amount_off: Math.round(couponData.amount_off / 100),
    max_redemptions: couponData.max_redemptions,
    coupon_name: couponData.name,
    percent_off: couponData.percent_off,
    times_redeemed: couponData.times_redeemed,
  };

  let data = {
    message: 'succ_142',
    data: couponDetails,
  };
  return data;
};

export const deleteCoupon = async (chef_id, coupon_code) => {
  logger.log(level.info, `>> deleteCoupon()`);
  await stripeService.couponDelete(coupon_code);
  await couponModel.delete({ chef_id, coupon_code });
  await chefPurchasePlanModel.update(
    { chef_id, status: 1 },
    { $inc: { remaining_coupon: 1 } }
  );
  let data = {
    message: 'succ_143',
  };
  return data;
};

export const updateCouponStatus = async (chef_id, coupon_id, status) => {
  logger.log(level.info, `>> updateCouponStatus()`);
  let data = {};
  if (status === 2) {
    data = {
      error: true,
      message: 'err_141',
    };
    return data;
  }
  await couponModel.update({ coupon_id, chef_id }, { $set: { status } });
  data = {
    error: false,
    message: 'succ_144',
  };
  return data;
};

export const couponList = async (chef_id, options) => {
  logger.log(level.info, `>> couponList()`);
  let [couponDoc, count] = await Promise.all([
    couponModel.get({ chef_id, status: { $ne: 3 } }, '', options),
    couponModel.count({ chef_id, status: { $ne: 3 } }),
  ]);

  let coupons = couponDoc.map((coupon) => {
    let { coupon_code, name, coupon_id, chef_id, status, expired_at } = coupon;
    let data = {
      coupon_name: name,
      coupon_code,
      coupon_id,
      chef_id,
      status,
      expired_at,
    };
    data.type = getType(coupon);
    data.discount_value = getDiscountValue(coupon);
    return data;
  });

  let data = {
    message: 'succ_145',
    count,
    data: coupons,
  };
  return data;
};

const getType = (coupon) => {
  if (coupon.percent_off && coupon.percent_off !== null)
    return 'Percentage Discount';
  if (coupon.amount_off && coupon.amount_off !== null)
    return 'Fixed Amount Discount';
};

const getDiscountValue = (coupon) => {
  if (coupon.percent_off && coupon.percent_off !== null)
    return coupon.percent_off;
  if (coupon.amount_off && coupon.amount_off !== null) return coupon.amount_off;
};
