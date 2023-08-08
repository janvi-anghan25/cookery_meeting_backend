import { level, logger } from '../../config/logger';
import chefModel from '../../models/chef';
import chefPurchasePlanModel from '../../models/package_purchase';
import portfolioModel from '../../models/portfolio';
import recipeModel from '../../models/recipe';
import { constants as WASABI_BUCKET_CONST } from '../../constant/wasabi';
import { uploadImage } from '../../utils/utility';

/* eslint-disable */
export const createPortfolio = async (chef_id, body, files) => {
  logger.log(level.info, `>> createPortfolio()`);

  let data = {};
  let isEligible = await checkEligible(chef_id);

  // ? check errors
  if (isEligible) return isEligible;

  body.recipeAndTime = JSON.parse(body.recipeAndTime);
  body.amount = JSON.parse(body.amount);

  // if (files) {
  //   let bucketUsedFor = '-portfolio';
  //   let addImages = await uploadImage(
  //     files,
  //     WASABI_BUCKET_CONST.COOKEY_MEETING_BUCKET,
  //     bucketUsedFor
  //   );
  //   body.images = addImages.uploadedImage.images;
  // }
  let [addedPortfolio, editRemainingPortfolio] = await Promise.all([
    portfolioModel.add({ ...body, chef_id }),

    chefPurchasePlanModel.update(
      { chef_id, status: 1 },
      { $inc: { remaining_portfolio: -1 } }
    ),
  ]);

  logger.log(
    level.info,
    `>> createPortfolio updatedRemaining Portfolio = ${editRemainingPortfolio.remaining_portfolio}`
  );

  data = {
    error: false,
    message: 'succ_51',
    data: addedPortfolio,
  };
  return data;
};

const checkEligible = async (chef_id, query) => {
  let data = {};

  let activePackageData = await chefPurchasePlanModel.get({
    chef_id,
    status: 1,
  });

  // ? Check if user has any active package
  if (!activePackageData || activePackageData.length <= 0) {
    data = {
      error: true,
      message: 'err_51',
    };
    return data;
  }

  activePackageData = activePackageData[0];
  // ? Active package has > 0 remaining portfolio
  if (activePackageData.remaining_portfolio <= 0) {
    data = {
      error: true,
      message: 'err_52',
    };
    return data;
  }

  // ? Portfolio exist or not
  if (query) {
    let portfolioData = await portfolioModel.get(
      { chef_id, ...query },
      '-status -created_at -updated_at -portfolio_id -_id -__v'
    );
    if (!portfolioData || portfolioData.length <= 0) {
      data = {
        error: true,
        message: 'err_58',
      };
      return { data };
    }
    return portfolioData;
  }
};

export const updatePortfolio = async (chef_id, query, body, files) => {
  logger.log(level.info, `>> updatePortfolio()`);

  if (body.recipeAndTime) {
    body.recipeAndTime = JSON.parse(body.recipeAndTime);
  }

  if (body.amount) {
    body.amount = JSON.parse(body.amount);
  }

  let { existing_images } = body;

  if (files) {
    let imagesArr = [];
    let bucketUsedFor = '-portfolio';

    // ? Check if there is any existing image or not
    if (existing_images && existing_images.length > 0) {
      existing_images = JSON.parse(existing_images);
      existing_images.map((img) => imagesArr.push(img));
    }

    // ? Use upload Image Function it returns portfolioImage object
    let addImages = await uploadImage(
      files,
      WASABI_BUCKET_CONST.COOKEY_MEETING_BUCKET,
      bucketUsedFor
    );

    // ? concat both imageArr and New PortfolioImages
    imagesArr = [...imagesArr, ...addImages.uploadedImage.images];
    body.images = imagesArr;
  } else if (existing_images) {
    existing_images = JSON.parse(existing_images);

    if (existing_images.length > 0) {
      body.images = existing_images;
    } else {
      body.images = [];
    }
  }

  let editPortfolio = await portfolioModel.update(
    { ...query, chef_id },
    { $set: body }
  );
  logger.log(level.info, `>> updatePortfolio() = ${editPortfolio}`);
  let data = {
    error: false,
    message: 'succ_52',
  };
  return data;
};

export const deletePortfolio = async (chef_id, query) => {
  logger.log(level.info, `>> deletePortfolio()`);

  await Promise.all([
    portfolioModel.delete({ ...query, chef_id }),
    chefPurchasePlanModel.update(
      { chef_id, status: 1 },
      { $inc: { remaining_portfolio: 1 } }
    ),
  ]);

  let data = {
    error: false,
    message: 'succ_53',
  };
  return data;
};

export const getPortfolio = async (chef_id, query) => {
  logger.log(level.info, `>> getPortfolio()`);

  let getPortfolioDetails = await portfolioModel.get({ ...query, chef_id });
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
  detailedJson.images = images;
  detailedJson.recipeAndTime = promiseRecipeDetails;
  detailedJson.created_at = created_at;
  detailedJson.description = description;

  data = {
    error: false,
    message: 'succ_54',
    data: detailedJson,
  };
  return data;
};

export const updatePortfolioStatus = async (chef_id, query, body) => {
  logger.log(level.info, `>> updatePortfolioStatus()`);
  let data = {};

  if (body.status === 1) {
    let publishedProfile = await chefModel.isExist({
      chef_id,
      publish_account: true,
    });

    // ? Check if chef account is connected to market place or not
    // ? if publish profile is false then can not active portfolio
    if (!publishedProfile) {
      data = {
        error: true,
        message: 'err_81',
      };
      return data;
    }
  }

  await portfolioModel.update(
    { ...query, chef_id },
    { $set: { status: body.status } }
  );

  data = {
    error: false,
    message: 'succ_56',
  };
  return data;
};

export const listPortfolio = async (filter, options) => {
  logger.log(level.info, `>> listPortfolio()`);
  let [getPortfolios, count] = await Promise.all([
    portfolioModel.get(filter, '', options),
    portfolioModel.count(filter),
  ]);
  let data = {};
  if (getPortfolios && getPortfolios.length > 0) {
    data = {
      message: 'succ_57',
      count,
      data: getPortfolios,
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

export const duplicatePortfolio = async (chef_id, query) => {
  logger.log(level.info, `>> duplicatePortfolio()`);

  let isEligible = await checkEligible(chef_id, query);

  // ? check errors
  if (isEligible.error) {
    return isEligible;
  }

  let portfolioData = isEligible[0];
  portfolioData = JSON.parse(JSON.stringify(portfolioData));

  let duplicatePortfolio = await portfolioModel.add(portfolioData);

  if (duplicatePortfolio && Object.keys(duplicatePortfolio).length > 0) {
    await chefPurchasePlanModel.update(
      { chef_id, status: 1 },
      { $inc: { remaining_portfolio: -1 } }
    );
  }

  let data = {
    error: false,
    message: 'succ_56',
  };
  return data;
};

export const activeRecipe = async (chef_id, options) => {
  logger.log(level.info, `>> activeRecipe()`);
  let [recipeDoc, count] = await Promise.all([
    recipeModel.get({ chef_id, status: 1 }, '', options),
    recipeModel.count({ chef_id, status: 1 }),
  ]);
  if (recipeDoc && recipeDoc.length > 0) {
    let data = {
      message: 'succ_75',
      count,
      data: recipeDoc,
    };
    return data;
  }
  let data = {
    message: 'succ_75',
    count: 0,
    data: [],
  };
  return data;
};
