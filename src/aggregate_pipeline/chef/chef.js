import { level, logger } from '../../config/logger';

export const eligibilityPipeline = (chef_id) => {
  logger.log(level.info, `>> eligibilityPipeline()`);
  let pipeline = [
    { $match: { chef_id } },
    {
      $lookup: {
        from: 'chefs',
        localField: 'chef_id',
        foreignField: 'chef_id',
        as: 'chefData',
      },
    },
    { $unwind: '$chefData' },
    { $project: { _id: 0, stripe_user_id: '$chefData.stripe_user_id' } },
  ];

  return pipeline;
};

export const pipelineForOrderChart = (chef_id) => {
  logger.log(level.info, `>> pipelineForOrderChart()`);
  const dateObject = new Date();
  const year = dateObject.getFullYear();

  let pipeline = [
    {
      $addFields: {
        year: { $year: '$created_at' },
      },
    },
    {
      $match: { chef_id: chef_id, year: year },
    },
    {
      $group: {
        _id: { $month: '$created_at' },
        total: { $sum: 1 },
      },
    },
  ];

  return pipeline;
};
