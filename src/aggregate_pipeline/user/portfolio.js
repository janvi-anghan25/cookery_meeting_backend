import { level, logger } from '../../config/logger';

export const getPipelineForPortfolioRating = (
  portfolio_id,
  extraParams,
  count
) => {
  logger.log(level.info, `>> getPipelineForPortfolioRating()`);
  let pipeline = [
    { $match: { portfolio_id } },
    {
      $lookup: {
        from: 'users',
        localField: 'user_id',
        foreignField: 'user_id',
        as: 'userData',
      },
    },
    { $unwind: '$userData' },
    {
      $project: {
        rating: 1,
        title: 1,
        review: 1,
        chef_id: 1,
        user_id: 1,
        rating_to: 1,
        rating_id: 1,
        created_at: 1,
        firstname: '$userData.firstname',
        lastname: '$userData.lastname',
        profile_image: '$userData.profile_image',
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

export const getPipelineForTopPortfolios = (top) => {
  logger.log(level.info, `>> getPipelineForTopPortfolios()`);
  let pipeline = [
    { $match: { status: 1 } },
    {
      $lookup: {
        from: 'ratings',
        let: { portfolio_id: '$portfolio_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ['$portfolio_id', '$$portfolio_id'] }],
              },
            },
          },
          {
            $group: {
              _id: '$objectId',
              avgRating: { $avg: '$rating' },
              reviews: { $sum: 1 },
            },
          },
        ],
        as: 'ratingData',
      },
    },
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
        images: 1,
        portfolio_name: 1,
        chef_id: 1,
        portfolio_id: 1,
        reviews: { $arrayElemAt: ['$ratingData.reviews', 0] },
        avgRating: { $arrayElemAt: ['$ratingData.avgRating', 0] },
        firstname: '$chefData.firstname',
        lastname: '$chefData.lastname',
        profile_image: '$chefData.profile_image',
        description: 1,
      },
    },
    { $limit: top },
    { $sort: { avgRating: -1 } },
    { $match: { avgRating: { $gt: 3 } } },
  ];
  return pipeline;
};

export const pipelineForPortfolioList = (filter, extraParams, count) => {
  logger.log(level.info, `>> pipelineForPortfolioList()`);
  let pipeline = [
    { $match: filter },
    {
      $lookup: {
        from: 'ratings',
        let: { portfolio_id: '$portfolio_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ['$portfolio_id', '$$portfolio_id'] }],
              },
            },
          },
          {
            $group: {
              _id: '$objectId',
              avgRating: { $avg: '$rating' },
              reviews: { $sum: 1 },
            },
          },
        ],
        as: 'ratingData',
      },
    },
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
        currency: 1,
        images: 1,
        description: 1,
        status: 1,
        is_default: 1,
        portfolio_name: 1,
        recipeAndTime: 1,
        amount: 1,
        chef_id: 1,
        portfolio_id: 1,
        created_at: 1,
        updated_at: 1,
        firstname: '$chefData.firstname',
        lastname: '$chefData.lastname',
        profile_image: '$chefData.profile_image',
        reviews: { $arrayElemAt: ['$ratingData.reviews', 0] },
        avgRating: { $arrayElemAt: ['$ratingData.avgRating', 0] },
      },
    },
    { $sort: { created_at: -1 } },
    // { $match: { avgRating: { $gt: 0 } } },
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

export const pipelineForUpcomingMeeting = (filter, extraParams, count) => {
  logger.log(level.info, `>> pipelineForPortfolioList()`);
  let pipeline = [
    { $unwind: '$portfolios' },
    {
      $match: filter,
    },
    {
      $lookup: {
        from: 'chefs',
        localField: 'chef_id',
        foreignField: 'chef_id',
        as: 'chefData',
      },
    },
    {
      $project: {
        order_number: 1,
        portfolio_name: '$portfolios.portfolio_name',
        date: '$portfolios.date',
        chef_name: {
          $arrayElemAt: ['$chefData.firstname', 0],
        },
        status: 1,
      },
    },
    // { $match: { avgRating: { $gt: 0 } } },
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
