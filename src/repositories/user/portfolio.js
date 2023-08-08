import { level, logger } from '../../config/logger';
import chefTimeSlotModel from '../../models/chef_time_slot';
import orderModel from '../../models/order';
import portfolioModel from '../../models/portfolio';
import ratingsModel from '../../models/ratings';
import recipeModel from '../../models/recipe';
import * as portfolioPipeline from '../../aggregate_pipeline/user/portfolio';
import * as utilityFunctions from '../../utils/utility';
import chefModel from '../../models/chef';

export const getChefPortfolio = async (filter, options) => {
  logger.log(level.info, `>> getChefPortfolio()`);

  const chefPortfolios = await portfolioModel.aggregate(
    portfolioPipeline.pipelineForPortfolioList(filter, options)
  );

  let countPipeline = portfolioPipeline.pipelineForPortfolioList(
    filter,
    {},
    true
  );

  let count = await utilityFunctions.getCountPipeline(
    portfolioModel,
    chefPortfolios,
    countPipeline
  );

  let data = {};
  if (chefPortfolios && chefPortfolios.length > 0) {
    data = {
      message: 'succ_57',
      count,
      data: chefPortfolios,
    };
    return data;
  }
  data = {
    message: 'succ_57',
    count: 0,
    data: [],
  };
  return data;
};

export const listPortfolio = async (filter, options) => {
  logger.log(level.info, `>> listPortfolio()`);

  const allPortfolio = await portfolioModel.aggregate(
    portfolioPipeline.pipelineForPortfolioList(filter, options)
  );

  let countPipeline = portfolioPipeline.pipelineForPortfolioList(
    filter,
    {},
    true
  );

  let count = await utilityFunctions.getCountPipeline(
    portfolioModel,
    allPortfolio,
    countPipeline
  );

  let data = {};
  if (allPortfolio && allPortfolio.length > 0) {
    data = {
      message: 'succ_57',
      count,
      data: allPortfolio,
    };
    return data;
  }
  data = {
    message: 'succ_57',
    count: 0,
    data: [],
  };
  return data;
};

export const getPortfolioDetails = async (query) => {
  logger.log(level.info, `>> getPortfolioDetails()`);

  let getPortfolioDetails = await portfolioModel.get({ ...query, status: 1 });
  let ratingData = await ratingsModel.get(query);
  let reviews = 0;
  let rating = 0;
  if (ratingData && ratingData.length > 0) {
    reviews = ratingData.length;
    ratingData.map((rated) => {
      rating = rating + rated.rating;
      return rating;
    });
  }

  let data = {};

  // ?  If portfolio does not exist then return error
  if (!getPortfolioDetails || getPortfolioDetails.length <= 0) {
    data = {
      error: true,
      message: 'err_58',
    };
    return data;
  }

  getPortfolioDetails = getPortfolioDetails[0];
  let {
    recipeAndTime,
    currency,
    status,
    is_default,
    portfolio_name,
    amount,
    portfolio_id,
    chef_id,
    images,
    created_at,
    description,
  } = getPortfolioDetails;

  let recipeTimeData = [];
  let recipeData = {};
  let [promiseRecipeDetails] = await Promise.all(
    recipeAndTime.map(async (recipe) => {
      let recipes = await recipeModel.get({
        chef_id,
        recipe_id: recipe.recipe,
      });

      recipeData = {
        time: recipe.time,
        recipe_id: recipe.recipe,
        recipe: recipes,
      };
      recipeTimeData.push(recipeData);
      return recipeTimeData;
    })
  );

  // ? Create Final Detailed JSON of Portfolio details
  let detailedJson = {};
  detailedJson.currency = currency;
  detailedJson.status = status;
  detailedJson.is_default = is_default;
  detailedJson.portfolio_name = portfolio_name;
  detailedJson.amount = amount;
  detailedJson.chef_id = chef_id;
  detailedJson.portfolio_id = portfolio_id;
  detailedJson.recipeAndTime = promiseRecipeDetails;
  detailedJson.images = images;
  detailedJson.created_at = created_at;
  detailedJson.reviews = reviews;
  detailedJson.description = description;
  if (reviews > 0) {
    detailedJson.rating = Number((rating / reviews).toFixed(1));
  }

  let chefData = await chefModel.get({ chef_id: getPortfolioDetails.chef_id });
  if (chefData && chefData.length > 0) {
    chefData = chefData[0];
    detailedJson.firstname = chefData.firstname;
    detailedJson.lastname = chefData.lastname;
    detailedJson.email = chefData.email;
    detailedJson.profile_image = chefData.profile_image;
  }

  data = {
    error: false,
    message: 'succ_54',
    data: detailedJson,
  };
  return data;
};

export const getChefUnavailableDates = async (filter) => {
  logger.log(level.info, `>> getChefUnavailableDates()`);
  let chef_id;
  if (filter.portfolio_id) {
    let portfolioData = await portfolioModel.get({
      portfolio_id: filter.portfolio_id,
    });
    if (portfolioData && portfolioData.length > 0) {
      portfolioData = portfolioData[0];
      chef_id = portfolioData.chef_id;
    }
  }
  if (filter.chef_id) {
    chef_id = filter.chef_id;
  }
  let getDates = await unavailableDates(chef_id);
  let data = {
    message: 'succ_92',
    data: getDates,
  };
  return data;
};

export const unavailableDates = async (chef_id) => {
  logger.log(level.info, `>> unavailableDates()`);
  let [workingDayData] = await chefTimeSlotModel.get({ chef_id });

  let unavailable_weekDays = workingDayData.working_days;
  let busyWeekDayAndDates = {};
  busyWeekDayAndDates.weekDays = unavailable_weekDays;

  let dates = [];

  Object.keys(workingDayData.not_working_dates).map((keys, _index) => {
    // ? Chefs Added Dates
    if (workingDayData.not_working_dates[keys] && keys === 'unavailable_on') {
      dates = [...dates, ...workingDayData.not_working_dates[keys]];
      return dates;
    }

    // ? User Booked Dates
    if (workingDayData.not_working_dates[keys] && keys === 'booked_dates') {
      workingDayData.not_working_dates[keys].map((bookedDate) => {
        dates = [...dates, bookedDate.date];
        return dates;
      });
    }
  });
  busyWeekDayAndDates.dates = dates;
  return busyWeekDayAndDates;
};

export const topPortfolioList = async (top) => {
  logger.log(level.info, `>> topPortfolioList()`);
  let portfolioList = await portfolioModel.aggregate(
    portfolioPipeline.getPipelineForTopPortfolios(Number(top))
  );

  let data = {
    message: 'succ_174',
    data: portfolioList,
  };
  return data;
};

export const addRatingToPortfolio = async (user_id, portfolio_id, body) => {
  logger.log(level.info, `>> addRatingToPortfolio()`);
  let rating_to = 'PORTFOLIO';
  let data = {};
  let orderFilter = {
    portfolios: { $elemMatch: { portfolio_id } },
    user_id,
    refunded: false,
    status: 5,
  };
  let ratingFilter = {
    user_id,
    portfolio_id,
    rating_to,
  };
  let errorExist = await handleErrorCheck(orderFilter, ratingFilter);
  if (errorExist) return errorExist;
  const [portfolioData] = await portfolioModel.get({ portfolio_id });
  let addRating = await ratingsModel.add({
    ...body,
    portfolio_id,
    user_id,
    rating_to,
    chef_id: portfolioData.chef_id,
  });
  data = {
    error: false,
    message: 'succ_171',
    data: addRating,
  };
  return data;
};

const handleErrorCheck = async (orderFilter, ratingsFilter) => {
  logger.log(level.info, `>> handleErrorCheck()`);

  let [userHadOrders, ratingExist] = await Promise.all([
    orderModel.isExist(orderFilter),
    ratingsModel.isExist(ratingsFilter),
  ]);
  let data = {};
  if (!userHadOrders) {
    data = { error: true, message: 'err_171' };
    return data;
  }

  if (ratingExist) {
    data = { error: true, message: 'err_172' };
    return data;
  }
};

export const getPortfolioRating = async (portfolio_id, options) => {
  logger.log(level.info, `>> getPortfolioRating()`);
  let portfolioList = await ratingsModel.aggregate(
    portfolioPipeline.getPipelineForPortfolioRating(portfolio_id, options)
  );

  let countPipeline = portfolioPipeline.getPipelineForPortfolioRating(
    portfolio_id,
    {},
    true
  );

  let count = await utilityFunctions.getCountPipeline(
    ratingsModel,
    portfolioList,
    countPipeline
  );
  let data = {
    message: 'succ_172',
    count,
    data: portfolioList,
  };
  return data;
};
