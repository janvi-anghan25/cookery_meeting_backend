import { logger, level } from '../../config/logger';
import moment from 'moment';
import chefModel from '../../models/chef';
import userModel from '../../models/user';

export const getCardData = async () => {
  logger.log(level.debug, `>> getCardData()`);

  let monthOldDate = moment().subtract(30, 'days').calendar();
  let filterNewUserData = {
    created_at: {
      $gte: monthOldDate,
    },
  };

  let [total_chefs, total_new_chefs, total_users, total_new_users] =
    await Promise.all([
      chefModel.count({}),
      chefModel.count(filterNewUserData),
      userModel.count({}),
      userModel.count(filterNewUserData),
    ]);

  let data = {
    message: 'succ_181',
    total_chefs,
    total_new_chefs,
    total_users,
    total_new_users,
  };

  return data;
};
