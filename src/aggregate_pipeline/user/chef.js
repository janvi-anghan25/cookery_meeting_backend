import { level, logger } from '../../config/logger';

export const getPipelineForChef = (filter, extraParams, count) => {
  logger.log(level.info, `>> getPipelineForChef()`);
  let pipeline = [
    { $match: { publish_account: true, status: 1 } },
    {
      $lookup: {
        from: 'recipes',
        let: { chef_id: '$chef_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$chef_id', '$$chef_id'] },
                  { $eq: ['$status', 1] },
                ],
              },
            },
          },
        ],
        as: 'recipeData',
      },
    },
    {
      $lookup: {
        from: 'portfolios',
        let: { chef_id: '$chef_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$chef_id', '$$chef_id'] },
                  { $eq: ['$status', 1] },
                  { $eq: ['$publish_account', true] },
                ],
              },
            },
          },
        ],
        as: 'portfolioData',
      },
    },
    {
      $lookup: {
        from: 'ratings',
        let: { chef_id: '$chef_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ['$chef_id', '$$chef_id'] }],
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
        as: 'ratingsData',
      },
    },
    { $addFields: { totalRecipe: { $size: '$recipeData' } } },
    { $addFields: { totalPortfolio: { $size: '$portfolioData' } } },
    {
      $project: {
        firstname: 1,
        lastname: 1,
        country: 1,
        chef_id: 1,
        created_at: 1,
        totalRecipe: 1,
        totalPortfolio: 1,
        status: 1,
        profile_image: 1,
        fullname: { $concat: ['$firstname', '$lastname'] },
        reviews: { $arrayElemAt: ['$ratingsData.reviews', 0] },
        avgRating: { $arrayElemAt: ['$ratingsData.avgRating', 0] },
      },
    },
    { $match: filter },

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

export const getChefDetailsPipeline = (chef_id) => {
  logger.log(level.info, `>> getChefDetailsPipeline()`);
  let pipeline = [
    { $match: { publish_account: true, status: 1, chef_id } },
    {
      $lookup: {
        from: 'recipes',
        let: { chef_id: '$chef_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$chef_id', '$$chef_id'] },
                  { $eq: ['$status', 1] },
                ],
              },
            },
          },
        ],
        as: 'recipeData',
      },
    },
    {
      $lookup: {
        from: 'portfolios',
        let: { chef_id: '$chef_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$chef_id', '$$chef_id'] },
                  { $eq: ['$status', 1] },
                ],
              },
            },
          },
        ],
        as: 'portfolioData',
      },
    },
    {
      $lookup: {
        from: 'ratings',
        let: { chef_id: '$chef_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ['$chef_id', '$$chef_id'] }],
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
        as: 'ratingsData',
      },
    },
    { $addFields: { totalRecipe: { $size: '$recipeData' } } },
    { $addFields: { totalPortfolio: { $size: '$portfolioData' } } },
    {
      $project: {
        status: 1,
        email: 1,
        firstname: 1,
        lastname: 1,
        country: 1,
        chef_id: 1,
        profile_image: 1,

        totalRecipe: 1,
        totalPortfolio: 1,

        reviews: { $arrayElemAt: ['$ratingsData.reviews', 0] },
        avgRating: { $arrayElemAt: ['$ratingsData.avgRating', 0] },

        // ? Recipe Data
        'recipeData.recipe_id': 1,
        'recipeData.nutritional_information': 1,
        'recipeData.ingredients': 1,
        'recipeData.description': 1,
        'recipeData.recipe_name': 1,
        'recipeData.recipe_options': 1,
        'recipeData.images': 1,
        'recipeData.status': 1,

        // ? Portfolio Data
        'portfolioData.status': 1,
        'portfolioData.portfolio_name': 1,
        'portfolioData.recipeAndTime': 1,
        'portfolioData.amount': 1,
        'portfolioData.portfolio_id': 1,
      },
    },
  ];
  return pipeline;
};

export const getPipelineForChefRating = (chef_id, extraParams, count) => {
  logger.log(level.info, `>> getPipelineForChefRating()`);
  let pipeline = [
    { $match: { chef_id, rating_to: 'CHEF' } },
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

export const getPipelineForTopChefs = (top) => {
  logger.log(level.info, `>> getPipelineForTopChefs()`);
  let pipeline = [
    { $match: { publish_account: true, status: 1 } },
    {
      $lookup: {
        from: 'ratings',
        let: { chef_id: '$chef_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ['$chef_id', '$$chef_id'] }],
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
        as: 'ratingsData',
      },
    },
    {
      $project: {
        firstname: 1,
        lastname: 1,
        email: 1,
        profile_image: 1,
        chef_id: 1,
        country: 1,
        reviews: { $arrayElemAt: ['$ratingsData.reviews', 0] },
        avgRating: { $arrayElemAt: ['$ratingsData.avgRating', 0] },
      },
    },
    { $limit: top },
    { $sort: { avgRating: -1 } },
    { $match: { avgRating: { $gt: 3 } } },
  ];
  return pipeline;
};
