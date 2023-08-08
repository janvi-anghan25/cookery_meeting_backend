import { logger, level } from '../../config/logger';
import promoCodeModel from '../../models/promoCode';
import chefPurchasePlanModel from '../../models/package_purchase';
import chefModel from '../../models/chef';
import moment from 'moment';
import { addInvoice } from './package';

export const applyPromo = async (body, currentChef, query) => {
  logger.log(level.info, `>> applyPromo()`);
  let { promocode_value } = body;
  let { chef_id } = currentChef;
  let { apply_immediately } = query;
  let data = {};

  let [isPackageActive, getPromoData, chefData] = await Promise.all([
    chefPurchasePlanModel.get({ status: 1, chef_id }),
    promoCodeModel.get({ promocode_value, status: 0 }),
    chefModel.get({ chef_id: chef_id }),
  ]);

  let notEligible = eligibleToBuy(
    chefData,
    getPromoData,
    isPackageActive,
    apply_immediately
  );

  if (notEligible.error) return notEligible;

  getPromoData = getPromoData[0];

  let expireNextDayObject = moment(getPromoData.expiry_date)
    .add(1, 'days')
    .toDate();
  let expireNextDay = moment(expireNextDayObject).format('L');
  let todayDate = moment().format('L');

  if (expireNextDay === todayDate) {
    await promoCodeModel.update(
      { promocode_value },
      {
        $set: {
          promocode_status: 2,
        },
      }
    );
    data = {
      error: true,
      message: 'err_46',
    };
  }
  let totalUsedPortfolios = 0;
  let totalUsedRecipes = 0;
  let totalUsedCoupons = 0;

  // ? if active package then inactive it
  if (isPackageActive && isPackageActive.length > 0) {
    await chefPurchasePlanModel.updateMany(
      { chef_id },
      { $set: { status: 0 } }
    );
    isPackageActive = isPackageActive[0];
    const {
      maximum_portfolio,
      remaining_portfolio,
      maximum_recipe,
      remaining_recipe,
      maximum_coupon,
      remaining_coupon,
    } = isPackageActive;

    totalUsedPortfolios = maximum_portfolio - remaining_portfolio;
    totalUsedRecipes = maximum_recipe - remaining_recipe;
    totalUsedCoupons = maximum_coupon - remaining_coupon;
  }

  const purchasePromoJson = {};
  let {
    promo_code_id,
    promo_code_name,
    maximum_portfolio,
    maximum_recipe,
    maximum_coupon,
  } = getPromoData;
  purchasePromoJson.type = 'PROMO';
  purchasePromoJson.promocode_id = promo_code_id;
  purchasePromoJson.package_name = promo_code_name;
  purchasePromoJson.chef_id = chef_id;
  purchasePromoJson.maximum_portfolio = maximum_portfolio;
  purchasePromoJson.remaining_portfolio =
    maximum_portfolio - totalUsedPortfolios;
  purchasePromoJson.maximum_recipe = maximum_recipe;
  purchasePromoJson.remaining_recipe = maximum_recipe - totalUsedRecipes;
  purchasePromoJson.maximum_coupon = maximum_coupon;
  purchasePromoJson.remaining_coupon = maximum_coupon - totalUsedCoupons;
  purchasePromoJson.status = 1;

  let chefPurchaseData = await chefPurchasePlanModel.add(purchasePromoJson);

  logger.log(level.info, `>> applyPromo() ${chefPurchaseData}`);

  await promoCodeModel.update(
    {
      promocode_value: promocode_value,
    },
    {
      $set: {
        status: 1,
        claimed_by: chef_id,
        claim_date: new Date(),
      },
    }
  );

  await chefModel.update(
    { chef_id },
    {
      $set: { current_active_package: chefPurchaseData.chef_id },
    }
  );

  chefData = chefData[0];
  await addInvoice(chefPurchaseData, chefData.firstname, chefData.email, '');

  data = {
    error: false,
    message: 'succ_43',
  };
  return data;
};

const eligibleToBuy = (
  chefData,
  getPromoData,
  isPackageActive,
  apply_immediately
) => {
  let data = {};

  if (!apply_immediately) {
    if (isPackageActive && isPackageActive.length > 0) {
      data = {
        error: true,
        message: 'err_44',
      };
    }
  }

  if (chefData && chefData.length === 0) {
    data = {
      error: true,
      message: 'err_43',
    };
  } else if (getPromoData && getPromoData.length > 0) {
    getPromoData = getPromoData[0];

    if (!apply_immediately) {
      if (getPromoData.status === 1) {
        data = {
          error: true,
          message: 'err_45',
        };
      } else if (getPromoData.status === 2) {
        data = {
          error: true,
          message: 'err_46',
        };
      } else if (getPromoData.claimed_by) {
        data = {
          error: true,
          message: 'err_45',
        };
      }
    }
  } else if (getPromoData && getPromoData.length === 0) {
    data = {
      error: true,
      message: 'err_48',
    };
  } else {
    data = { error: false };
  }
  return data;
};
