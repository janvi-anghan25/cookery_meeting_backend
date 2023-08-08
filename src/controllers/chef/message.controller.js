import { logger, level } from '../../config/logger';
import { serverError, successResponse } from '../../utils/utility';
import * as messageRepo from '../../repositories/chef/message';

export const getMessages = async (req, res) => {
  logger.log(level.info, `>> getMessages()`);

  try {
    let messageData = await messageRepo.getMessages(req.query);
    successResponse(res, messageData);
  } catch (error) {
    logger.log(level.error, `<< getMessages Error=${error}`);
    serverError(res);
  }
};

export const getAllUsers = async (req, res) => {
  logger.log(level.info, `>> getAllUsers()`);

  try {
    let userData = await messageRepo.getAllUsers();
    successResponse(res, userData);
  } catch (error) {
    logger.log(level.error, `<< getAllUsers Error=${error}`);
    serverError(res);
  }
};

export const updateRoom = async (req, res) => {
  logger.log(level.info, `>> updateRoom()`);

  try {
    let userData = await messageRepo.updateRoom(req.query);
    successResponse(res, userData);
  } catch (error) {
    logger.log(level.error, `<< updateRoom Error=${error}`);
    serverError(res);
  }
};

export const getAllChefs = async (req, res) => {
  logger.log(level.debug, `>> getAllChefs()`);

  try {
    let chefData = await messageRepo.getAllChefs();
    successResponse(res, chefData);
  } catch (error) {
    logger.log(level.error, `<< getAllChefs error=${error}`);
    serverError(res);
  }
};

export const addRoom = async (req, res) => {
  logger.log(level.debug, `>> addRoom()`);

  try {
    let roomData = await messageRepo.addRoom(req.body);
    successResponse(res, roomData);
  } catch (error) {
    logger.log(level.error, `<< addRoom error=${error}`);
    serverError(res);
  }
};

export const getRoom = async (req, res) => {
  logger.log(level.debug, `>> getRoom()`);

  try {
    let roomData = await messageRepo.getRoom(req.query);
    successResponse(res, roomData);
  } catch (error) {
    logger.log(level.error, `<< getRoom error=${error}`);
    serverError(res);
  }
};
