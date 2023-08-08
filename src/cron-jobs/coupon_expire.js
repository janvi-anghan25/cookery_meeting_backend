import { scheduleJob } from 'node-schedule';
import { logger, level } from '../config/logger';
import moment from 'moment-timezone';
import { constants as APP_CONST } from '../constant/application';
import couponModel from '../models/coupon';

// let RUN_TIME = '* * * * * *';
// ? Run at 12:10 AM
let RUN_TIME = '10 0 * * *';

scheduleJob(RUN_TIME, async (fireDate) => {
  logger.log(
    level.info,
    `>> expired_date Supposed to run at ${moment(fireDate)
      .tz(APP_CONST.DEFAULT_TIMEZONE)
      .format()} , but actually ran at ${moment()
      .tz(APP_CONST.DEFAULT_TIMEZONE)
      .format()}`
  );

  const todayDate = moment().format('L');
  const filterCoupon = {
    status: 1,
    expired_at: { $lt: todayDate },
  };
  try {
    const couponData = await couponModel.get(filterCoupon);

    if (couponData && couponData.length > 0) {
      await couponModel.updateMany(filterCoupon, { $set: { status: 2 } });
      logger.log(
        level.info,
        `>> expired_at total ${couponData.length} Coupon expired today`
      );
    } else {
      logger.log(level.info, `>> There is no Coupon are Expiring Today`);
    }
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
