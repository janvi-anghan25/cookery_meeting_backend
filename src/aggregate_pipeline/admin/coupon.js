import { level, logger } from '../../config/logger';

export const getCouponListPipeline = (extraParams, count) => {
  logger.log(level.info, `>> getCouponListPipeline()`);
  let pipeline = [
    { $match: { status: { $ne: 3 } } },
    {
      $lookup: {
        from: 'chefs',
        localField: 'chef_id',
        foreignField: 'chef_id',
        as: 'chefData',
      },
    },
    { $unwind: '$chefData' },
    {
      $project: {
        chef_firstname: '$chefData.firstname',
        chef_lastname: '$chefData.lastname',
        email: '$chefData.email',
        chef_id: '$chefData.chef_id',
        duration: 1,
        coupon_code: 1,
        name: 1,
        expired_at: 1,
        created_at: 1,
        status: 1,
        percent_off: 1,
        amount_off: { $divide: ['$amount_off', 100] },
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
