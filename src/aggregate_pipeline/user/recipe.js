import { level, logger } from '../../config/logger';

export const getPipelineForRecipeRating = (recipe_id, extraParams, count) => {
  logger.log(level.info, `>> getPipelineForRecipeRating()`);
  let pipeline = [
    { $match: { recipe_id } },
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

export const getPipelineForTopRecipes = (top) => {
  logger.log(level.info, `>> getPipelineForTopRecipes()`);
  let pipeline = [
    { $match: { status: 1 } },
    {
      $lookup: {
        from: 'ratings',
        let: { recipe_id: '$recipe_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ['$recipe_id', '$$recipe_id'] }],
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
        recipe_name: 1,
        description: 1,
        images: 1,
        recipe_id: 1,
        reviews: { $arrayElemAt: ['$ratingsData.reviews', 0] },
        avgRating: { $arrayElemAt: ['$ratingsData.avgRating', 0] },
        chef_id: 1,
      },
    },
    { $limit: top },
    { $sort: { avgRating: -1 } },
    { $match: { avgRating: { $gt: 3 } } },
  ];
  return pipeline;
};

export const recipeDetailsPipeline = (filter) => {
  logger.log(level.info, `>> recipeDetailsPipeline()`);
  let pipeline = [
    { $match: filter },
    {
      $lookup: {
        from: 'ratings',
        let: { recipe_id: '$recipe_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ['$recipe_id', '$$recipe_id'] }],
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
        status: 1,
        recipe_options: 1,
        images: 1,
        recipe_name: 1,
        description: 1,
        ingredients: 1,
        nutritional_information: 1,
        recipe_method: 1,
        recipe_id: 1,
        chef_id: 1,
        reviews: { $arrayElemAt: ['$ratingsData.reviews', 0] },
        avgRating: { $arrayElemAt: ['$ratingsData.avgRating', 0] },
      },
    },
    { $sort: { avgRating: -1 } },
    // { $match: { avgRating: { $gt: 3 } } },
  ];
  return pipeline;
};

export const getPipelineForChefRecipe = (filter, extraParams, count) => {
  logger.log(level.info, `>> getPipelineForChefRecipe()`);
  let pipeline = [
    { $match: filter },
    {
      $lookup: {
        from: 'ratings',
        let: { recipe_id: '$recipe_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ['$recipe_id', '$$recipe_id'] }],
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
        status: 1,
        recipe_options: 1,
        images: 1,
        recipe_name: 1,
        description: 1,
        ingredients: 1,
        nutritional_information: 1,
        recipe_method: 1,
        recipe_id: 1,
        chef_id: 1,
        reviews: { $arrayElemAt: ['$ratingsData.reviews', 0] },
        avgRating: { $arrayElemAt: ['$ratingsData.avgRating', 0] },
        profile_image: '$chefData.profile_image',
      },
    },
    { $sort: { avgRating: -1 } },
    { $match: { avgRating: { $gt: 3 } } },
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
