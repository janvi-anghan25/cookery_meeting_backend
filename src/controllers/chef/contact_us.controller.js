import { logger, level } from '../../config/logger';
import {
  badRequestError,
  serverError,
  successResponse,
  standardStructureStringToJson,
  getOptionsJson,
} from '../../utils/utility';
import * as contactUsRepo from '../../repositories/chef/contact_us';
import { validationResult } from 'express-validator';

export const contactUsForm = async (req, res) => {
  logger.log(level.debug, `>> contactUsForm()`);
  let errors = validationResult(req);

  try {
    if (!errors.isEmpty()) return badRequestError(res, errors);
    let contactUsData = await contactUsRepo.contactUsForm(
      req.currentChef,
      req.body
    );
    successResponse(res, contactUsData);
  } catch (error) {
    logger.log(level.error, `<< contactUsForm Error = ${error}`);
    serverError(res);
  }
};

export const customerContactUs = async (req, res) => {
  logger.log(level.debug, `>> customerContactUs()`);
  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsJson(extraParams);
  const { chef_id } = req.currentChef;
  try {
    let contactUsData = await contactUsRepo.customerContactUs(chef_id, options);
    successResponse(res, contactUsData);
  } catch (error) {
    logger.log(level.error, `<< customerContactUs Error = ${error}`);
    serverError(res);
  }
};
