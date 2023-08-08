import { level, logger } from '../../../config/logger';
import chefModel from '../../../models/chef';
import * as stripeService from '../../../services/stripe/stripe';

export const connectStripeAccount = async (
  accountID,
  headerOrigin,
  email,
  country_code
) => {
  logger.log(level.info, `>> connectStripeAccount()`);

  let [chefDoc] = await chefModel.get({ email });
  let stripe_account_id;
  if (chefDoc && chefDoc.stripe_user_id) {
    stripe_account_id = chefDoc.stripe_user_id;
    accountID = stripe_account_id;
  } else {
    let create_account = await stripeService.createAccount(
      email,
      country_code.toUpperCase()
    );

    stripe_account_id = create_account.id;

    accountID = stripe_account_id;
    await chefModel.update(
      { email, status: 1 },
      { $set: { stripe_user_id: create_account.id } }
    );

    const origin = `${headerOrigin}`;
    const accountLinkURL = await stripeService.generateAccountLink(
      stripe_account_id,
      origin
    );
    let data = {
      message: 'succ_81',
      data: accountLinkURL,
    };
    return data;
  }
};

export const stripeUserDashboard = async (email, account) => {
  logger.log(level.info, `>> stripeUserDashboard()`);
  let [chefDoc] = await chefModel.get({ email });
  let { stripe_user_id } = chefDoc;
  const loginLink = await stripeService.createLoginLink(stripe_user_id);
  if (account) {
    loginLink.url = loginLink.url + '#/account';
  }
  let data = {};
  data = { message: 'succ_82', data: loginLink.url };
  return data;
};
