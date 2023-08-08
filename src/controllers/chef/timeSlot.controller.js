import { level, logger } from '../../config/logger';
import {
  badRequestError,
  getOptionsPipelineJson,
  serverError,
  standardStructureStringToJson,
  successResponse,
} from '../../utils/utility';
import * as timeSlotRepo from '../../repositories/chef/timeSlot';

export const addWorkDay = async (req, res) => {
  logger.log(level.debug, `>> addWorkDay()`);
  const { chef_id } = req.currentChef;
  try {
    let result = await timeSlotRepo.addWorkDay(chef_id, req.body);

    if (result.error) {
      return badRequestError(res, result.message);
    }

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< addWorkDay()  error=${error}`);
    serverError(res);
  }
};

export const getWorkDay = async (req, res) => {
  logger.log(level.debug, `>> getWorkDay()`);
  const { chef_id } = req.currentChef;
  try {
    let result = await timeSlotRepo.getWorkDay(chef_id);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< getWorkDay() error=${error}`);
    serverError(res);
  }
};

export const editWorkDay = async (req, res) => {
  logger.log(level.debug, `>> editWorkDay()`);
  const { chef_id } = req.currentChef;
  try {
    let result = await timeSlotRepo.editWorkDay(chef_id, req.body);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< editWorkDay() error=${error}`);
    serverError(res);
  }
};

export const deleteWorkDay = async (req, res) => {
  logger.log(level.debug, `>> deleteWorkDay()`);
  const { chef_id } = req.currentChef;
  try {
    let result = await timeSlotRepo.deleteWorkDay(
      chef_id,
      req.query.time_slot_id
    );

    if (result.error) {
      return badRequestError(res, result.message);
    }

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< deleteWorkDay() error=${error}`);
    serverError(res);
  }
};

export const orderBookedList = async (req, res) => {
  logger.log(level.debug, `>> orderBookedList()`);
  const { chef_id } = req.currentChef;
  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsPipelineJson(extraParams);
  try {
    let result = await timeSlotRepo.orderBookedList(chef_id, options);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< orderBookedList() error=${error}`);
    serverError(res);
  }
};
