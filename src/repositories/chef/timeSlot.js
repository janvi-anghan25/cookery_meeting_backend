import { level, logger } from '../../config/logger';
import * as utilityFunctions from '../../utils/utility';
import * as orderPipeline from '../../aggregate_pipeline/chef/order';
import chefTimeSlotModel from '../../models/chef_time_slot';
import user from '../../models/user';

export const addWorkDay = async (chef_id, body) => {
  logger.log(level.info, `>> addWorkDay()`);

  let chefDataExist = await chefTimeSlotModel.get({ chef_id });
  let data = {};
  if (chefDataExist && chefDataExist.length > 0) {
    data = {
      error: true,
      message: 'err_91',
    };
    return data;
  }

  if (body.working_days) {
    body.working_days = JSON.parse(body.working_days);
  }

  let not_working_dates = {};
  if (body.unavailable_on) {
    not_working_dates.unavailable_on = JSON.parse(body.unavailable_on);
    body.not_working_dates = not_working_dates;
  }

  let addedData = await chefTimeSlotModel.add({ ...body, chef_id });
  data = {
    error: false,
    message: 'succ_91',
    data: addedData,
  };
  return data;
};

export const getWorkDay = async (chef_id) => {
  logger.log(level.info, `>> getWorkDay()`);
  let getWorkDayData = await chefTimeSlotModel.get({ chef_id });

  let data = {};
  if (getWorkDayData && getWorkDayData.length > 0) {
    getWorkDayData = getWorkDayData[0];
    let workingDates = await userDetails(getWorkDayData);
    data = {
      message: 'succ_92',
      data: workingDates,
    };
    return data;
  }
  data = {
    message: 'succ_92',
    data: [],
  };
  return data;
};

const userDetails = async (getWorkDayData) => {
  logger.log(level.info, `>> userDetails()`);
  let meetingDates = getWorkDayData.not_working_dates.booked_dates;
  let workingDates = {};
  let userData = {};
  let bookedByUsers = [];

  let [userPromiseData] = await Promise.all(
    meetingDates.map(async (users) => {
      let [userDoc] = await user.get({ user_id: users.user_id });

      userData = {
        email: userDoc.email,
        firstname: userDoc.firstname,
        lastname: userDoc.lastname,
        phone_number: userDoc.phone_number,
        user_id: userDoc.user_id,
        date: users.date,
        status: users.status,
      };

      bookedByUsers.push(userData);
      return bookedByUsers;
    })
  );

  let not_working_dates = {
    unavailable_on: getWorkDayData.not_working_dates.unavailable_on,
    booked_dates: userPromiseData,
  };

  workingDates.working_days = getWorkDayData.working_days;
  workingDates.not_working_dates = not_working_dates;
  workingDates.chef_id = getWorkDayData.chef_id;
  workingDates.time_slot_id = getWorkDayData.time_slot_id;
  workingDates.created_at = getWorkDayData.created_at;

  return workingDates;
};

export const editWorkDay = async (chef_id, body) => {
  logger.log(level.info, `>> editWorkDay()`);
  const filter = {
    chef_id,
  };
  let data = {};

  let getWorkData = await chefTimeSlotModel.get(filter);
  if (!getWorkData || getWorkData.length <= 0) {
    data = {
      error: true,
      message: 'err_92',
    };
    return data;
  }

  if (body.working_days) {
    body.working_days = JSON.parse(body.working_days);
  }

  if (body.unavailable_on) {
    body.unavailable_on = JSON.parse(body.unavailable_on);
  }

  await chefTimeSlotModel.update(filter, {
    $set: {
      working_days: body.working_days,
      'not_working_dates.unavailable_on': body.unavailable_on,
    },
  });
  data = {
    error: false,
    message: 'succ_93',
  };
  return data;
};

export const deleteWorkDay = async (chef_id, time_slot_id) => {
  logger.log(level.info, `>> deleteWorkDay()`);
  let [getWorkDayData] = await chefTimeSlotModel.get({ chef_id, time_slot_id });
  let userBooking = getWorkDayData.not_working_dates.booked_dates;
  let data = {};
  if (userBooking && userBooking.length > 0) {
    data = {
      error: true,
      message: 'err_93',
    };
    return data;
  }
  await chefTimeSlotModel.delete({ chef_id, time_slot_id });
  data = {
    error: false,
    message: 'succ_94',
  };
  return data;
};

export const orderBookedList = async (chef_id, options) => {
  logger.log(level.info, `>> orderBookedList()`);
  let bookedList = await chefTimeSlotModel.aggregate(
    orderPipeline.getBookedOrderList(chef_id, options)
  );
  let countPipeline = orderPipeline.getBookedOrderList(chef_id, {}, true);

  let count = await utilityFunctions.getCountPipeline(
    chefTimeSlotModel,
    bookedList,
    countPipeline
  );

  let data = {
    message: 'succ_154',
    count,
    data: bookedList,
  };
  return data;
};
