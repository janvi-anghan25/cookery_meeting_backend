import { level, logger } from '../config/logger';

export const pipelineForChefTimeSlot = (todayDate) => {
  logger.log(level.info, `>> pipelineForChefTimeSlot()`);
  let pipeline = [
    {
      $project: {
        chef_id: 1,
        not_working_dates: {
          booked_dates: {
            $filter: {
              input: '$not_working_dates.booked_dates',
              as: 'booked_dates',
              cond: {
                $and: [
                  { $eq: ['$$booked_dates.status', 3] },
                  { $eq: ['$$booked_dates.date', todayDate] },
                ],
              },
            },
          },
        },
      },
    },
  ];
  return pipeline;
};
