import { level, logger } from '../../config/logger';
import * as orderRepo from '../../repositories/chef/order';
import {
  standardStructureStringToJson,
  getOptionsPipelineJson,
  serverError,
  successResponse,
  badRequestError,
} from '../../utils/utility';
import { validationResult } from 'express-validator';

export const orderList = async (req, res) => {
  logger.log(level.debug, `>> orderList()`);
  let { chef_id } = req.currentChef;
  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsPipelineJson(extraParams);
  try {
    let result = await orderRepo.orderList(chef_id, options);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< orderList() error=${error}`);
    serverError(res);
  }
};

export const orderDetails = async (req, res) => {
  logger.log(level.debug, `>> orderDetails()`);
  let { chef_id } = req.currentChef;
  let errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }
    let result = await orderRepo.orderDetails(chef_id, req.query.order_number);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< orderDetails() error=${error}`);
    serverError(res);
  }
};

export const orderRefundList = async (req, res) => {
  logger.log(level.debug, `>> orderRefundList()`);
  let { chef_id } = req.currentChef;
  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsPipelineJson(extraParams);
  try {
    let result = await orderRepo.orderRefundList(chef_id, options);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< orderRefundList() error=${error}`);
    serverError(res);
  }
};

export const orderRefundDetails = async (req, res) => {
  logger.log(level.debug, `>> orderRefundDetails()`);
  let { chef_id } = req.currentChef;
  try {
    let result = await orderRepo.orderRefundDetails(
      chef_id,
      req.query.refund_id
    );
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< orderRefundDetails() error=${error}`);
    serverError(res);
  }
};

export const editOrderStatus = async (req, res) => {
  logger.log(level.debug, `>> editOrderStatus()`);
  let { chef_id } = req.currentChef;
  try {
    let result = await orderRepo.editOrderStatus(
      chef_id,
      req.query.order_number,
      req.body.status
    );

    if (result.error) {
      return badRequestError(res, result.message);
    }

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< editOrderStatus() error=${error}`);
    serverError(res);
  }
};
