import { level, logger } from '../../config/logger';
import {
  badRequestError,
  getOptionsJson,
  serverError,
  standardStructureStringToJson,
  successResponse,
} from '../../utils/utility';
import * as couponRepo from '../../repositories/chef/coupon';
import { validationResult } from 'express-validator';

export const createCoupon = async (req, res) => {
  logger.log(level.debug, `>> createCoupon()`);
  const { chef_id } = req.currentChef;
  let errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }
    let result = await couponRepo.createCoupon(chef_id, req.body);

    if (result.error) {
      return badRequestError(res, result.message);
    }

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< createCoupon() error=${error}`);
    serverError(res);
  }
};

export const getCouponDetails = async (req, res) => {
  logger.log(level.debug, `>> getCouponDetails()`);
  let errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }

    let result = await couponRepo.getCouponDetails(req.query.coupon_code);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< getCouponDetails() error=${error}`);
    serverError(res);
  }
};

export const deleteCoupon = async (req, res) => {
  logger.log(level.debug, `>> deleteCoupon()`);
  let { chef_id } = req.currentChef;
  let errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }

    let result = await couponRepo.deleteCoupon(chef_id, req.query.coupon_code);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< deleteCoupon() error=${error}`);
    serverError(res);
  }
};

export const updateCouponStatus = async (req, res) => {
  logger.log(level.debug, `>> updateCouponStatus()`);
  let { chef_id } = req.currentChef;
  let errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }

    let result = await couponRepo.updateCouponStatus(
      chef_id,
      req.query.coupon_id,
      req.body.status
    );

    if (result.error) {
      return badRequestError(res, result.message);
    }

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< updateCouponStatus() error=${error}`);
    serverError(res);
  }
};

export const couponList = async (req, res) => {
  logger.log(level.debug, `>> couponList()`);
  const { chef_id } = req.currentChef;
  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsJson(extraParams);
  try {
    let result = await couponRepo.couponList(chef_id, options);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< couponList()`);
    serverError(res);
  }
};
