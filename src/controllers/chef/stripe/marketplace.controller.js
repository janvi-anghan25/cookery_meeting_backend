import { level, logger } from '../../../config/logger';
import { serverError, successResponse } from '../../../utils/utility';
import * as stripeRepo from '../../../repositories/chef/stripe/marketplace';
import { constants as APP_CONST } from '../../../constant/application';
import * as stripeService from '../../../services/stripe/stripe';
import chefModel from '../../../models/chef';
import recipeModel from '../../../models/recipe';

export const connectStripeAccount = async (req, res) => {
  logger.log(level.debug, `>> connectStripeAccount()`);
  let { country_code, email } = req.currentChef;
  try {
    let result = await stripeRepo.connectStripeAccount(
      req.session.accountID,
      req.headers.origin,
      email,
      country_code
    );
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< connectStripeAccount() error=${error}`);
    serverError(res);
  }
};

export const generateRefreshAccountLink = async (req, res) => {
  if (!req.session.accountID) {
    res.redirect(APP_CONST.CHEF_UI_URL + '/chef/dashboard');
    return;
  }
  try {
    const { accountID } = req.session;
    const origin = `${req.secure ? 'https://' : 'https://'}${req.headers.host}`;

    const accountLinkURL = await stripeService.generateAccountLink(
      accountID,
      origin
    );
    res.redirect(accountLinkURL);
  } catch (err) {
    res.status(500).send({
      error: err.message,
    });
  }
};

export const stripeUserDashboard = async (req, res) => {
  let { email } = req.currentChef;

  let { account } = req.query;
  try {
    let result = await stripeRepo.stripeUserDashboard(email, account);

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< stripeUserDashboard() error= ${error}`);
    serverError(res);
  }
};

export const getStripeAccount = async (req, res) => {
  let { chef_id } = req.currentChef;
  try {
    let [chefDoc] = await chefModel.get({ chef_id });

    if (chefDoc.stripe_user_id === null) {
      const data = {
        data: false,
      };
      return successResponse(res, data);
    }

    if (chefDoc.stripe_user_id !== null) {
      let info = await stripeService.accountInfo(chefDoc.stripe_user_id);

      let obj = {
        charges_enabled: info.charges_enabled,
        payouts_enabled: info.payouts_enabled,
      };
      if (info.charges_enabled === false || info.payouts_enabled === false) {
        await Promise.all([
          chefModel.update(
            { chef_id },
            { $set: { stripe_user_id: null, publish_account: false } }
          ),
          recipeModel.updateMany({ chef_id }, { $set: { status: 0 } }),
        ]);
      }
      const data = {
        message: 'succ_83',
        data: obj,
      };
      successResponse(res, data);
    }
  } catch (error) {
    logger.log(level.error, error);
    serverError(res);
  }
};
