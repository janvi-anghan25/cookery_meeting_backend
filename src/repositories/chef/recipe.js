import { level, logger } from '../../config/logger';
import chefModel from '../../models/chef';
import portfolioModel from '../../models/portfolio';
import recipeModel from '../../models/recipe';
import { constants as WASABI_BUCKET_CONST } from '../../constant/wasabi';
import { uploadImage } from '../../utils/utility';
import chefPurchasePlanModel from '../../models/package_purchase';
/* eslint-disable */
export const addRecipe = async (chef_id, body, files) => {
  logger.log(level.info, `>> addRecipe()`);

  let isEligible = await checkEligible(chef_id);

  // ? check errors
  if (isEligible) return isEligible;

  if (body.ingredients) {
    body.ingredients = JSON.parse(body.ingredients);
  }

  if (body.recipe_options) {
    body.recipe_options = JSON.parse(body.recipe_options);
  }

  if (body.nutritional_information) {
    body.nutritional_information = JSON.parse(body.nutritional_information);
  }

  if (body.recipe_method) {
    body.recipe_method = JSON.parse(body.recipe_method);
  }

  // if (files) {
  //   let bucketUsedFor = '-recipe';
  //   let addFiles = await uploadImage(
  //     files,
  //     WASABI_BUCKET_CONST.COOKEY_MEETING_BUCKET,
  //     bucketUsedFor
  //   );
  //   body.images = addFiles.uploadedImage.images;
  // }

  let [addedRecipe, editRemainingRecipe] = await Promise.all([
    recipeModel.add({ ...body, chef_id }),

    chefPurchasePlanModel.update(
      { chef_id, status: 1 },
      { $inc: { remaining_recipe: -1 } }
    ),
  ]);

  logger.log(
    level.info,
    `>> addRecipe updatedRemaining Recipe = ${editRemainingRecipe.remaining_recipe}`
  );

  let data = {};
  data = {
    error: false,
    message: 'succ_71',
    data: addedRecipe,
  };
  return data;
};

const checkEligible = async (chef_id) => {
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
  // ? Active package has > 0 remaining recipe
  if (activePackageData.remaining_recipe <= 0) {
    data = {
      error: true,
      message: 'err_79',
    };
    return data;
  }
};

export const updateRecipe = async (chef_id, query, body, files) => {
  logger.log(level.info, `>> updateRecipe()`);
  let data = {};

  let isRecipeExist = await recipeExist(chef_id, query.recipe_id);
  if (isRecipeExist.error) {
    return isRecipeExist;
  }

  if (body.ingredients) {
    body.ingredients = JSON.parse(body.ingredients);
  }

  if (body.recipe_options) {
    body.recipe_options = JSON.parse(body.recipe_options);
  }

  if (body.nutritional_information) {
    body.nutritional_information = JSON.parse(body.nutritional_information);
  }

  if (body.recipe_method) {
    body.recipe_method = JSON.parse(body.recipe_method);
  }

  let { existing_images } = body;

  if (files) {
    let imagesArr = [];
    let bucketUsedFor = '-recipe';

    // ? Check if there is any existing image or not
    if (existing_images && existing_images.length > 0) {
      existing_images = JSON.parse(existing_images);
      existing_images.map((img) => imagesArr.push(img));
    }

    // ? Use upload Image Function it returns recipeImage object
    let addImages = await uploadImage(
      files,
      WASABI_BUCKET_CONST.COOKEY_MEETING_BUCKET,
      bucketUsedFor
    );

    // ? concat both imageArr and New RecipeImages
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

  let addedRecipe = await recipeModel.update(
    { ...query, chef_id },
    { $set: body }
  );
  data = {
    error: false,
    message: 'succ_73',
    data: addedRecipe,
  };
  return data;
};

export const deleteRecipe = async (chef_id, query) => {
  logger.log(level.info, `>> deleteRecipe()`);
  let data = {};

  let filter = {
    chef_id,
    recipeAndTime: { $elemMatch: { recipe: query.recipe_id } },
  };

  let [isRecipeExist, portfolioData] = await Promise.all([
    recipeExist(chef_id, query.recipe_id),
    portfolioModel.get(filter),
  ]);

  if (portfolioData && portfolioData.length > 0) {
    data = {
      error: true,
      message: 'err_77',
    };
    return data;
  }

  if (isRecipeExist.error) {
    return isRecipeExist;
  }

  await Promise.all([
    recipeModel.delete({ chef_id, ...query }),
    chefPurchasePlanModel.update(
      { chef_id, status: 1 },
      { $inc: { remaining_recipe: 1 } }
    ),
  ]);

  await recipeModel.delete({ chef_id, ...query });
  data = {
    error: false,
    message: 'succ_74',
  };
  return data;
};

export const getRecipe = async (chef_id, query) => {
  logger.log(level.info, `>> getRecipe()`);
  let recipeData = await recipeModel.get({ ...query, chef_id });
  let data = {};
  if (recipeData && recipeData.length > 0) {
    recipeData = recipeData[0];
    data = {
      error: false,
      message: 'succ_72',
      data: recipeData,
    };
    return data;
  }
  data = {
    error: true,
    message: 'err_74',
  };
  return data;
};

export const getAllRecipes = async (filter, options) => {
  logger.log(level.info, `>> getAllRecipes()`);
  let data = {};
  let [allRecipes, count] = await Promise.all([
    recipeModel.get(filter, '', options),
    recipeModel.count(filter),
  ]);
  if (!allRecipes || allRecipes.length <= 0) {
    data = {
      message: 'succ_75',
      count: 0,
      data: [],
    };
    return data;
  }
  data = {
    message: 'succ_75',
    count,
    data: allRecipes,
  };
  return data;
};

export const updateRecipeStatus = async (chef_id, query, body) => {
  logger.log(level.info, `<< updateRecipeStatus()`);
  let data = {};
  let filter = {
    chef_id,
    recipeAndTime: { $elemMatch: { recipe: query.recipe_id } },
  };
  let [isRecipeExist, portfolioData] = await Promise.all([
    recipeExist(chef_id, query.recipe_id),
    portfolioModel.get(filter),
  ]);

  if (isRecipeExist.error) {
    return isRecipeExist;
  }

  if (body.status === 0 && portfolioData && portfolioData.length > 0) {
    data = {
      error: true,
      message: 'err_78',
    };
    return data;
  }

  if (body.status === 1) {
    let publishedProfile = await chefModel.isExist({
      chef_id,
      publish_account: true,
    });

    // ? Check if chef account is connected to market place or not
    // ? if publish profile is false then can not active recipe
    if (!publishedProfile) {
      data = {
        error: true,
        message: 'err_81',
      };
      return data;
    }
  }

  await recipeModel.update(
    { chef_id, ...query },
    { $set: { status: body.status } }
  );
  data = {
    error: false,
    message: 'succ_75',
  };
  return data;
};

// ? Function to Check if Recipe Exist or Not
const recipeExist = async (chef_id, recipe_id) => {
  logger.log(level.info, '>> recipeExist()');
  let recipeExist = await recipeModel.isExist({ chef_id, recipe_id });

  let data = {};

  if (!recipeExist) {
    data = {
      error: true,
      message: 'err_74',
    };
    return data;
  }
  data = {
    error: false,
  };
  return data;
};
