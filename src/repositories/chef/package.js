import { level, logger } from '../../config/logger';
import chefModel from '../../models/chef';
import chefInvoiceModel from '../../models/chef_invoice';
import packageModel from '../../models/package';
import chefPurchasePlanModel from '../../models/package_purchase';
import { chargeChef } from '../../services/stripe/stripe';

import { constants as APP_CONST } from '../../constant/application';
import { constants as SENDGRID_CONST } from '../../constant/sendgrid';
import sendGrid from '../../utils/sendgrid';

export const getAllPackage = async (options) => {
  logger.log(level.info, `>> getAllPackage()`);
  let [packageList, count] = await Promise.all([
    packageModel.get({ status: 1 }, '', options),
    packageModel.count({ status: 1 }),
  ]);
  let data = {};
  if (packageList && packageList.length > 0) {
    data = {
      message: 'succ_22',
      count,
      data: packageList,
    };
    return data;
  }
  data = { message: 'succ_22', count: 0, data: [] };
};

export const getPackageDetails = async (package_id) => {
  logger.log(level.info, `>> getPackageDetails()`);

  let [packageData] = await packageModel.get({ package_id, status: 1 });

  let data = { message: 'succ_23', data: packageData };
  return data;
};

export const buyPackage = async (chef_id, query, body) => {
  logger.log(level.info, `>> buyPackage()`);
  let { package_id, apply_immediately } = query;

  let [isPackageActive, getPackageData, [chefData], isCurrentPackage] =
    await Promise.all([
      chefPurchasePlanModel.get({ status: 1, chef_id }),
      packageModel.get({ package_id, status: 1 }),
      chefModel.get({ chef_id }),
      chefPurchasePlanModel.get({ chef_id, package_id, status: 1 }),
    ]);

  let data = {};
  let notEligible = eligibleToBuy(
    isCurrentPackage,
    apply_immediately,
    isPackageActive,
    getPackageData
  );
  if (notEligible) return notEligible;

  getPackageData = getPackageData[0];
  let {
    currency,
    package_name,
    amount,
    maximum_portfolio,
    maximum_recipe,
    maximum_coupon,
  } = getPackageData;

  let metadata = {};
  // ? Package Amount is > 0
  if (body.source && getPackageData.amount > 0) {
    let stripePayed = await packageNotFree(
      body,
      getPackageData,
      metadata,
      chefData
    );
    if (stripePayed.error) {
      return stripePayed;
    }
    metadata = stripePayed;
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

  const purchasePackageJson = {};
  purchasePackageJson.type = 'PACKAGE';
  purchasePackageJson.chef_id = chef_id;
  purchasePackageJson.currency = currency;
  purchasePackageJson.package_name = package_name;
  purchasePackageJson.amount_spend = amount;
  purchasePackageJson.maximum_portfolio = maximum_portfolio;
  purchasePackageJson.maximum_recipe = maximum_recipe;
  purchasePackageJson.maximum_coupon = maximum_coupon;
  purchasePackageJson.remaining_portfolio =
    maximum_portfolio - totalUsedPortfolios;
  purchasePackageJson.remaining_recipe = maximum_recipe - totalUsedRecipes;
  purchasePackageJson.remaining_coupon = maximum_coupon - totalUsedCoupons;
  purchasePackageJson.package_id = package_id;
  purchasePackageJson.status = 1;
  purchasePackageJson.metadata = metadata;

  let chefPurchaseData = await chefPurchasePlanModel.add(purchasePackageJson);

  logger.log(level.info, `>> buyPackage() ${chefPurchaseData}`);

  /**
   * ? 1. Update in chefs current active package
   * ? 2. Add Invoice
   */
  await Promise.all([
    chefModel.update(
      { chef_id },
      { $set: { current_active_package: package_id } }
    ),
    addInvoice(chefPurchaseData, chefData.firstname, chefData.email, metadata),
  ]);

  data = { error: false, message: 'succ_27' };
  return data;
};

let eligibleToBuy = (
  isCurrentPackage,
  apply_immediately,
  isPackageActive,
  getPackageData
) => {
  let data = {};
  // ? Check selected package purchased
  if (isCurrentPackage && isCurrentPackage.length > 0) {
    data = {
      error: true,
      message: 'err_27',
    };
    return data;
  }

  // ? if apply_immediately === true then do not check below condition
  if (!apply_immediately) {
    // ? Chef Has already active package
    if (isPackageActive && isPackageActive.length > 0) {
      data = {
        error: true,
        message: 'err_25',
      };
      return data;
    }
  }

  // ? Package Exist
  if (!getPackageData || getPackageData.length <= 0) {
    data = {
      error: true,
      message: 'err_24',
    };
    return data;
  }

  // // ? Portfolio must be greater than previous active package
  // if (
  //   isPackageActive &&
  //   isPackageActive.length > 0 &&
  //   getPackageData &&
  //   getPackageData.length > 0
  // ) {
  //   isPackageActive = isPackageActive[0];
  //   getPackageData = getPackageData[0];
  //   if (getPackageData.maximum_portfolio < isPackageActive.maximum_portfolio) {
  //     data = {
  //       error: true,
  //       message: 'err_28',
  //     };
  //     return data;
  //   }
  // }
};

const packageNotFree = async (body, getPackageData, metadata, chefData) => {
  let {
    source,
    card_holder_name,
    address_line1,
    address_zip,
    address_city,
    address_state,
    address_country,
  } = body;

  const stripeBody = {};
  stripeBody.amount = Math.round(getPackageData.amount * 100);
  stripeBody.source = source;
  stripeBody.receipt_email = chefData.email;
  stripeBody.currency = getPackageData.currency;
  stripeBody.description = 'Chef Package';
  stripeBody.card_holder_name = card_holder_name;
  stripeBody.address_line1 = address_line1;
  stripeBody.address_zip = address_zip;
  stripeBody.address_city = address_city;
  stripeBody.address_state = address_state;
  stripeBody.address_country = address_country;

  const chargeResponse = await chargeChef(stripeBody);
  if (!chargeResponse) {
    let data = {
      error: true,
      message: 'err_26',
    };
    return data;
  }
  metadata.stripe_charge_id = chargeResponse.id;
  metadata.stripe_charge_balance_transaction =
    chargeResponse.balance_transaction;
  metadata.stripe_charge_payment_method = chargeResponse.payment_method;
  metadata.stripe_charge_receipt_url = chargeResponse.receipt_url;
  return metadata;
};

export const addInvoice = async (getPackageData, name, email, metadata) => {
  logger.log(level.debug, `>> addInvoice()`);
  let { chef_id, package_name, purchase_id, amount_spend, created_at, type } =
    getPackageData;

  let invoiceData = {
    package_name,
    purchase_id,
    name,
    email,
    chef_id,
    created_on: created_at,
    type,
  };

  if (metadata && Object.keys(metadata).length > 0) {
    logger.log(
      level.info,
      `addInvoice invoice url = ${metadata.stripe_charge_receipt_url}`
    );

    invoiceData.url = metadata.stripe_charge_receipt_url;
  }

  if (amount_spend) {
    invoiceData.amount_spend = amount_spend;
  }

  const userPackage = await chefInvoiceModel.add(invoiceData);
  logger.log(level.info, `addInvoice invoice data = ${userPackage}`);
  return userPackage;
};

export const packagePurchaseMail = async (email) => {
  const message = {
    to: email,
    from: SENDGRID_CONST.SENDGRID_FROM,
    templateId: SENDGRID_CONST.PACKAGE_PURCHASE_ID,
    dynamic_template_data: {
      APP_USERNAME: email,
      LOGO: APP_CONST.LOGO_URL,
    },
  };
  sendGrid(message);
};

export const activePackage = async (chef_id) => {
  logger.log(level.info, `>> activePackage()`);

  let [packageData] = await chefPurchasePlanModel.get({ chef_id, status: 1 });

  let data = {
    message: 'succ_28',
    data: packageData,
  };
  return data;
};
