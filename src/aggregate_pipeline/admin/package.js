import { level, logger } from '../../config/logger';

export const getPackageListPipeline = (extraParams, count) => {
  logger.log(level.info, `>> getPackageListPipeline()`);

  let pipeline = [
    { $match: { status: { $ne: 2 } } },
    {
      $lookup: {
        from: 'chef_purchase_plans',
        let: { package_id: '$package_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$package_id', '$$package_id'] },
                  { $eq: ['$status', 1] },
                ],
              },
            },
          },
        ],
        as: 'chefData',
      },
    },
    {
      $addFields: { chefsCount: { $size: '$chefData' } },
    },
    {
      $project: {
        currency: 1,
        status: 1,
        is_default: 1,
        package_name: 1,
        maximum_portfolio: 1,
        maximum_recipe: 1,
        maximum_coupon: 1,
        amount: 1,
        package_id: 1,
        created_at: 1,
        chefsCount: 1,
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

export const pipelineForLatestUserPackageList = (packageType, extraParams) => {
  const dateObject = new Date();
  const year = dateObject.getFullYear();

  let pipeline = [
    {
      $addFields: {
        year: { $year: '$created_at' },
      },
    },
    { $match: { type: packageType, year: year } },
    {
      $lookup: {
        from: 'chefs',
        localField: 'chef_id',
        foreignField: 'chef_id',
        as: 'user_id',
      },
    },
    {
      $unwind: '$user_id',
    },
    {
      $project: {
        fullname: { $concat: ['$user_id.firstname', ' ', '$user_id.lastname'] },
        email: '$user_id.email',
        price: '$amount_spend',
        date_of_purhased: {
          $dateToString: { format: '%Y-%m-%d', date: '$created_at' },
        },
        package_name: 1,
        expired: '$is_expired',
        status: '$is_active',
        invoice: '$metadata.stripe_charge_receipt_url',
        transaction_number: '$metadata.stripe_charge_balance_transaction',
        created_at: 1,
        purchase_id: 1,
      },
    },
    { $sort: { created_at: -1 } },
  ];

  if (extraParams.skip) pipeline.push({ $skip: Number(extraParams.skip) });
  if (extraParams.limit) pipeline.push({ $limit: Number(extraParams.limit) });

  return pipeline;
};
