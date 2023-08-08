import { level, logger } from '../../config/logger';
import * as invoiceRepo from '../../repositories/chef/invoice';
import {
  getOptionsJson,
  standardStructureStringToJson,
  serverError,
  successResponse,
} from '../../utils/utility';

export const invoiceDetails = async (req, res) => {
  logger.log(level.debug, `>> invoiceDetails()`);
  let { chef_id } = req.currentChef;
  let filter = { chef_id, invoice_id: req.query.invoice_id };
  try {
    let result = await invoiceRepo.invoiceDetails(filter);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< invoiceDetails() ${error}`);
    serverError(res);
  }
};

export const allInvoices = async (req, res) => {
  logger.log(level.debug, `>> allInvoices()`);
  let { chef_id } = req.currentChef;
  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsJson(extraParams);
  try {
    let result = await invoiceRepo.allInvoices(chef_id, options);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< allInvoices() error=${error}`);
    serverError(res);
  }
};
