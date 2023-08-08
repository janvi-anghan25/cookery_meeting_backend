import { level, logger } from '../../config/logger';
import * as cartRepo from '../../repositories/user/cart';
import {
  badRequestError,
  serverError,
  successResponse,
} from '../../utils/utility';
import { validationResult } from 'express-validator';

export const addToCart = async (req, res) => {
  logger.log(level.debug, `>> addToCart()`);
  let { user_id } = req.currentUser;
  let errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }

    let result = await cartRepo.addToCart(
      user_id,
      req.body,
      req.query.start_new_cart
    );

    if (result.error) {
      return badRequestError(res, result.message);
    }

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< addToCart() error=${error}`);
    serverError(res);
  }
};

export const myCart = async (req, res) => {
  logger.log(level.debug, `>> myCart()`);
  let { user_id } = req.currentUser;
  try {
    let result = await cartRepo.myCart(user_id);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< myCart() error=${error}`);
    serverError(res);
  }
};

export const removeCart = async (req, res) => {
  logger.log(level.debug, `>> removeCart()`);
  let { user_id } = req.currentUser;
  try {
    let result = await cartRepo.removeCart(user_id);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< removeCart() error=${error}`);
    serverError(res);
  }
};

export const editCart = async (req, res) => {
  logger.log(level.debug, `>> editCart()`);
  let { user_id } = req.currentUser;
  let errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }

    let result = await cartRepo.editCart(
      user_id,
      req.body,
      req.query.portfolio_id
    );

    if (result.error) {
      return badRequestError(res, result.message);
    }

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< editCart() error=${error}`);
    serverError(res);
  }
};

export const removeSinglePortfolio = async (req, res) => {
  logger.log(level.debug, `>> removeSinglePortfolio()`);
  let { user_id } = req.currentUser;
  let errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }

    let result = await cartRepo.removeSinglePortfolio(
      user_id,
      req.query.port_id
    );

    if (result.error) {
      return badRequestError(res, result.message);
    }

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< removeSinglePortfolio() error=${error}`);
    serverError(res);
  }
};

export const checkCartStatus = async (req, res) => {
  logger.log(level.debug, `>> checkCartStatus()`);
  let { user_id } = req.currentUser;
  try {
    let result = await cartRepo.checkCartStatus(user_id);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< checkCartStatus() error=${error}`);
    serverError(error);
  }
};

export const applyCoupon = async (req, res) => {
  logger.log(level.debug, `>> applyCoupon()`);
  let { user_id } = req.currentUser;
  let errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }

    let result = await cartRepo.applyCoupon(user_id, req.body.coupon_code);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< applyCoupon() error=${error}`);
    serverError(res);
  }
};
