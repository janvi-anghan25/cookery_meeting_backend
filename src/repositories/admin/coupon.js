import { logger, level } from '../../config/logger';
import couponModel from '../../models/coupon';
import * as utilityFunctions from '../../utils/utility';
import * as couponPipeline from '../../aggregate_pipeline/admin/coupon';
import { couponRetrieve } from '../../services/stripe/stripe';
import { Mapping } from '../../services/database/database_schema_operation';
import * as stripeService from '../../services/stripe/stripe';

export const getCouponList = async (options) => {
  logger.log(level.info, `>> getCouponList()`);
  let allCouponDoc = await couponModel.aggregate(
    couponPipeline.getCouponListPipeline(options)
  );

  allCouponDoc = Mapping(allCouponDoc);
  let countPipeline = couponPipeline.getCouponListPipeline({}, true);
  let count = await utilityFunctions.getCountPipeline(
    couponModel,
    allCouponDoc,
    countPipeline
  );
  let data = {
    message: 'succ_142',
    count,
    data: allCouponDoc,
  };
  return data;
};

export const getCouponDetails = async (coupon_code) => {
  logger.log(level.info, `>> getCouponDetails()`);

  let coupon = await couponRetrieve(coupon_code);
  let couponData = {
    coupon_code,
    currency: coupon.currency,
    duration: coupon.duration,
    max_redemptions: coupon.max_redemptions,
    percent_off: coupon.percent_off,
    amount_off: Math.round(coupon.amount_off / 100),
    times_redeemed: coupon.times_redeemed,
    valid: coupon.valid,
  };
  let data = {
    message: 'succ_142',
    data: couponData,
  };
  return data;
};

export const deleteCoupon = async (coupon_code) => {
  logger.log(level.info, `>> deleteCoupon()`);
  await stripeService.couponDelete(coupon_code);
  await couponModel.delete({ coupon_code });
  let data = {
    message: 'succ_143',
  };
  return data;
};
