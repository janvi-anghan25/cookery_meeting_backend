import { level, logger } from '../../config/logger';
import chefInvoiceModel from '../../models/chef_invoice';

export const invoiceDetails = async (filter) => {
  logger.log(level.info, `>> invoiceDetails()`);
  let [invoiceData] = await chefInvoiceModel.get(filter);
  let data = {
    message: 'succ_101',
    data: invoiceData,
  };
  return data;
};

export const allInvoices = async (chef_id, options) => {
  logger.log(level.info, `>> allInvoices()`);
  let [invoiceList, count] = await Promise.all([
    chefInvoiceModel.get({ chef_id }, '', options),
    chefInvoiceModel.count({ chef_id }),
  ]);
  let data = {
    message: 'succ_102',
    count,
    data: invoiceList,
  };
  return data;
};
