import { scheduleJob } from 'node-schedule';
import { logger, level } from '../config/logger';
import moment from 'moment-timezone';

import { constants as SENDGRID_CONST } from '../constant/sendgrid';
import { constants as APP_CONST } from '../constant/application';

import chefModel from '../models/chef';
import chefTimeSlotModel from '../models/chef_time_slot';
import portfolioModel from '../models/portfolio';
import recipeModel from '../models/recipe';
import user from '../models/user';
import * as cronJobPipeline from '../aggregate_pipeline/cron_job_pipeline';
import sendGrid from '../utils/sendgrid';

// let RUN_TIME = '*/10 * * * * *';
// ? Run at 08:10 AM
let RUN_TIME = '10 8 * * *';

scheduleJob(RUN_TIME, async (fireDate) => {
  logger.log(
    level.info,
    `>> expired_date Supposed to run at ${moment(fireDate)
      .tz(APP_CONST.DEFAULT_TIMEZONE)
      .format()} , but actually ran at ${moment()
      .tz(APP_CONST.DEFAULT_TIMEZONE)
      .format()}`
  );

  let today = new Date();
  let addDays = moment(today).add(1, 'days');
  let todayDate = moment(addDays).format('YYYY-MM-DD');

  try {
    let chefTimeSlotData = await chefTimeSlotModel.aggregate(
      cronJobPipeline.pipelineForChefTimeSlot(todayDate)
    );
    chefTimeSlotData.map((TimeSlotData) => {
      let { chef_id } = TimeSlotData;

      TimeSlotData.not_working_dates.booked_dates.map(async (portfolioID) => {
        let { user_id } = portfolioID;

        let [portfoliosData] = await portfolioModel.get({
          portfolio_id: portfolioID.portfolio_id,
        });
        let portfoliosRecipe = portfoliosData.recipeAndTime;
        let recipeArr = [];
        let recipeDetails = {};

        let [promiseRecipe] = await Promise.all(
          portfoliosRecipe.map(async (recipe) => {
            let [recipeData] = await recipeModel.get({
              recipe_id: recipe.recipe,
            });

            recipeDetails = {
              recipe_name: recipeData.recipe_name,
              ingredients: recipeData.ingredients,
            };

            recipeArr.push(recipeDetails);

            return recipeArr;
          })
        );
        let recipeIngredientsList = '';
        promiseRecipe.map(async (ingredientsDetails) => {
          let { ingredients, recipe_name } = ingredientsDetails;

          let singleRecipe = '';

          ingredients.map((ingredient) => {
            let ingredientList = '';
            ingredient.ingredients_details.map((data) => {
              ingredientList = ingredientList + `<li>${data}</li>`;
              return ingredientList;
            });

            if (ingredient.ingredients_for === null) {
              singleRecipe = singleRecipe + `<ul>` + `${ingredientList}</ul>`;
              return singleRecipe;
            }

            singleRecipe =
              singleRecipe +
              `<ul><h4>${ingredient.ingredients_for}</h4>` +
              `${ingredientList}</ul>`;

            return singleRecipe;
          });

          recipeIngredientsList =
            recipeIngredientsList + `<h2>${recipe_name}</h2>` + singleRecipe;
          return recipeIngredientsList;
        });
        await sendRecipeIngredientMail(chef_id, user_id, recipeIngredientsList);
      });
    });
  } catch (error) {
    logger.log(level.error, `>> expire_at JOB error ${error}`);
  }

  logger.log(
    level.info,
    `>> expired_date JOB executed successfully at ${moment()
      .tz(APP_CONST.DEFAULT_TIMEZONE)
      .format()}`
  );
});

export const sendRecipeIngredientMail = async (
  chef_id,
  user_id,
  recipeIngredientsList
) => {
  logger.log(level.info, `>> sendRecipeIngredientMail()`);
  let [[userData], [chefData]] = await Promise.all([
    user.get({ user_id }),
    chefModel.get({ chef_id }),
  ]);
  const message = {
    to: userData.email,
    from: SENDGRID_CONST.SENDGRID_FROM,
    templateId: SENDGRID_CONST.INGREDIENT_LIST,
    dynamic_template_data: {
      NAME: userData.firstname,
      CHEF_EMAIL: chefData.email,
      LOGO: APP_CONST.LOGO_URL,
      INGREDIENT_LIST: recipeIngredientsList,
    },
  };
  sendGrid(message);
};
