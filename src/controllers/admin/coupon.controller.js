import { level, logger } from '../../config/logger';
import * as couponRepo from '../../repositories/admin/coupon';
import {
  standardStructureStringToJson,
  getOptionsPipelineJson,
  serverError,
  successResponse,
  badRequestError,
} from '../../utils/utility';
import { validationResult } from 'express-validator';

export const getCouponList = async (req, res) => {
  logger.log(level.debug, `>> getCouponList()`);
  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsPipelineJson(extraParams);
  try {
    let result = await couponRepo.getCouponList(options);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< getCouponList() error=${error}`);
    serverError(res);
  }
};

export const getCouponDetails = async (req, res) => {
  logger.log(level.debug, `>> getCouponDetails()`);
  try {
    let result = await couponRepo.getCouponDetails(req.query.coupon_code);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< getCouponDetails() error=${error}`);
    serverError(res);
  }
};

export const deleteCoupon = async (req, res) => {
  logger.log(level.debug, `>> deleteCoupon()`);
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }
    let result = await couponRepo.deleteCoupon(req.query.coupon_code);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< deleteCoupon() error=${error}`);
    serverError(res);
  }
};
