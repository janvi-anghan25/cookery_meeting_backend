import { level, logger } from '../../config/logger';

export const getPipelineForPurchaseList = (filter, extraParams, count) => {
  logger.log(level.info, `>> getPipelineForPurchaseList()`);
  let pipeline = [
    { $match: filter },
    {
      $lookup: {
        from: 'chef_invoices',
        localField: 'purchase_id',
        foreignField: 'purchase_id',
        as: 'invoiceData',
      },
    },
    {
      $unwind: '$invoiceData',
    },
    {
      $project: {
        amount_spend: 1,
        type: 1,
        chef_id: 1,
        package_name: 1,
        maximum_portfolio: 1,
        remaining_portfolio: 1,
        maximum_recipe: 1,
        remaining_recipe: 1,
        maximum_coupon: 1,
        remaining_coupon: 1,
        package_id: 1,
        status: 1,
        purchase_id: 1,
        created_at: 1,
        invoice_url: '$invoiceData.url',
      },
    },
    { $sort: { created_at: -1 } },
  ];

  if (count) {
    pipeline.push({
      $count: 'total',
    });
  }
  if (extraParams) {
    if (extraParams.skip) pipeline.push({ $skip: Number(extraParams.skip) });
    if (extraParams.limit) pipeline.push({ $limit: Number(extraParams.limit) });
  }

  return pipeline;
};
