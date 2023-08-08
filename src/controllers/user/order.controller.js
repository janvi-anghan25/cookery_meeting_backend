import { logger, level } from '../../config/logger';
import {
  badRequestError,
  getOptionsJson,
  getOptionsPipelineJson,
  serverError,
  standardStructureStringToJson,
  successResponse,
} from '../../utils/utility';
import * as orderRepo from '../../repositories/user/order';
import { validationResult } from 'express-validator';

export const getCheckoutSession = async (req, res) => {
  logger.log(level.debug, `>> getCheckoutSession()`);
  let { user_id } = req.currentUser;
  try {
    let result = await orderRepo.getCheckoutSession(user_id);

    if (result.error) {
      return badRequestError(res, result.message);
    }

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< getCheckoutSession() error=${error}`);
    serverError(res);
  }
};

export const getOrderList = async (req, res) => {
  logger.log(level.debug, `>> getOrderList()`);
  let { user_id } = req.currentUser;
  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsPipelineJson(extraParams);
  try {
    let result = await orderRepo.getOrderList(user_id, options);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< getOrderList() error=${error}`);
    serverError(res);
  }
};

export const orderDetails = async (req, res) => {
  logger.log(level.debug, `>> orderDetails()`);
  let { user_id } = req.currentUser;
  let errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }
    let result = await orderRepo.orderDetails(user_id, req.query.order_number);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< orderDetails() error=${error}`);
    serverError(res);
  }
};

export const cancelOrder = async (req, res) => {
  logger.log(level.debug, `>> cancelOrder()`);
  let { user_id } = req.currentUser;
  let errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }

    let result = await orderRepo.cancelOrder(user_id, req.query.order_number);

    if (result.error) {
      return badRequestError(res, result.message);
    }

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< cancelOrder() error=${error}`);
    serverError(res);
  }
};

export const orderRefundList = async (req, res) => {
  logger.log(level.debug, `>> orderRefundList()`);
  let { user_id } = req.currentUser;
  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsJson(extraParams);
  try {
    let result = await orderRepo.orderRefundList(user_id, options);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< orderRefundList() error=${orderRefundList}`);
    serverError(res);
  }
};

export const orderRefundDetails = async (req, res) => {
  logger.log(level.debug, `>> orderRefundDetails()`);
  let { user_id } = req.currentUser;
  let errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }

    let result = await orderRepo.orderRefundDetails(
      user_id,
      req.query.refund_id
    );
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< orderRefundDetails() error=${error}`);
    serverError(res);
  }
};

export const upcomingMeeting = async (req, res) => {
  logger.log(level.debug, `>> upcomingMeeting()`);
  let { user_id } = req.currentUser;
  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsPipelineJson(extraParams);

  try {
    let result = await orderRepo.upcomingMeeting(user_id, options);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< upcomingMeeting() error=${error}`);
    serverError(res);
  }
};
