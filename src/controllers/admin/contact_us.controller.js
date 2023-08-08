import { logger, level } from '../../config/logger';
import {
  getOptionsJson,
  serverError,
  standardStructureStringToJson,
  successResponse,
} from '../../utils/utility';
import * as contactUsRepo from '../../repositories/admin/contact_us';

export const listOfChefContactUs = async (req, res) => {
  logger.log(level.debug, `>> listOfChefContactUs()`);
  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsJson(extraParams);

  try {
    let contactUsData = await contactUsRepo.listOfChefContactUs(options);
    successResponse(res, contactUsData);
  } catch (error) {
    logger.log(level.error, `<< listOfChefContactUs Error = ${error}`);
    serverError(res);
  }
};

export const listOfCustomerContactUs = async (req, res) => {
  logger.log(level.debug, `>> listOfCustomerContactUs()`);
  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsJson(extraParams);

  try {
    let contactUsData = await contactUsRepo.listOfCustomerContactUs(options);
    successResponse(res, contactUsData);
  } catch (error) {
    logger.log(level.error, `<< listOfCustomerContactUs Error = ${error}`);
    serverError(res);
  }
};

export const listOfUserContactUs = async (req, res) => {
  logger.log(level.debug, `>> listOfUserContactUs()`);
  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsJson(extraParams);

  try {
    let contactUsData = await contactUsRepo.listOfUserContactUs(options);
    successResponse(res, contactUsData);
  } catch (error) {
    logger.log(level.error, `<< listOfUserContactUs Error = ${error}`);
    serverError(res);
  }
};
