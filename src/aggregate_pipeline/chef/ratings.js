export const pipelineForRatings = (ratingsFilter, extraParams, count) => {
  let pipeline = [
    { $match: ratingsFilter },
    {
      $lookup: {
        from: 'users',
        localField: 'user_id',
        foreignField: 'user_id',
        as: 'userData',
      },
    },
    {
      $lookup: {
        from: 'recipes',
        localField: 'recipe_id',
        foreignField: 'recipe_id',
        as: 'recipeData',
      },
    },
    {
      $lookup: {
        from: 'portfolios',
        localField: 'portfolio_id',
        foreignField: 'portfolio_id',
        as: 'portfolioData',
      },
    },
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
        recipe_id: 1,
        portfolio_id: 1,
        firstname: { $arrayElemAt: ['$userData.firstname', 0] },
        lastname: { $arrayElemAt: ['$userData.lastname', 0] },
        email: { $arrayElemAt: ['$userData.email', 0] },
        recipe_name: { $arrayElemAt: ['$recipeData.recipe_name', 0] },
        portfolio_name: { $arrayElemAt: ['$portfolioData.portfolio_name', 0] },
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
