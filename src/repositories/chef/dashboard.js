import { level, logger } from '../../config/logger';
import chefPurchasePlanModel from '../../models/package_purchase';
import portfolioModel from '../../models/portfolio';
import recipeModel from '../../models/recipe';
import couponModel from '../../models/coupon';
import orderModel from '../../models/order';
import { pipelineForOrderChart } from '../../aggregate_pipeline/chef/chef';

export const getCardData = async (chef_id) => {
  logger.log(level.info, `>> getCardData()`);

  let [
    purchasedData,
    activePortfolioCount,
    activeRecipeCount,
    activeCouponCount,
  ] = await Promise.all([
    chefPurchasePlanModel.get({ chef_id, status: 1 }),
    portfolioModel.count({ chef_id, status: 1 }),
    recipeModel.count({ chef_id, status: 1 }),
    couponModel.count({ chef_id, status: 1 }),
  ]);

  let dashboardData = {
    maximum_portfolio: 0,
    remaining_portfolio: 0,
    activePortfolioCount: activePortfolioCount !== 0 ? activePortfolioCount : 0,
    maximum_recipe: 0,
    remaining_recipe: 0,
    activeRecipeCount: activeRecipeCount !== 0 ? activeRecipeCount : 0,
    maximum_coupon: 0,
    remaining_coupon: 0,
    activeCouponCount: activeCouponCount !== 0 ? activeCouponCount : 0,
  };

  if (purchasedData && purchasedData.length > 0) {
    purchasedData = purchasedData[0];
    dashboardData.maximum_portfolio = purchasedData.maximum_portfolio;
    dashboardData.remaining_portfolio = purchasedData.remaining_portfolio;
    dashboardData.maximum_recipe = purchasedData.maximum_recipe;
    dashboardData.remaining_recipe = purchasedData.remaining_recipe;
    dashboardData.maximum_coupon = purchasedData.maximum_coupon;
    dashboardData.remaining_coupon = purchasedData.remaining_coupon;
  }

  return dashboardData;
};

export const getOrdersChart = async (chef_id) => {
  logger.log(level.info, `>> getOrdersChart`);

  let orderChartData = await orderModel.aggregate(
    pipelineForOrderChart(chef_id)
  );

  let orderData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  for (let elem of orderChartData) {
    if (elem && elem._id && !isNaN(elem._id)) {
      orderData[elem._id - 1] = elem.total;
    }
  }

  let data = {
    message: 'succ_193',
    data: orderData,
  };

  return data;
};
