import { level, logger } from '../../config/logger';

export const getPipelineForOrderList = (chef_id, extraParams, count) => {
  logger.log(level.info, `>> getPipelineForOrderList()`);
  let pipeline = [
    { $match: { chef_id, is_deleted: false } },
    {
      $lookup: {
        from: 'users',
        localField: 'user_id',
        foreignField: 'user_id',
        as: 'userData',
      },
    },
    { $unwind: '$userData' },
    {
      $project: {
        // billing_address: 1,
        // shipping_address: 1,
        is_deleted: 1,
        amount_discount: 1,
        order_number: 1,
        payment_intent: 1,
        user_id: 1,
        refunded: 1,
        chef_id: 1,
        receipt_url: 1,
        status: 1,
        total_amount: 1,
        portfolios: 1,
        created_at: 1,
        firstname: '$userData.firstname',
        lastname: '$userData.lastname',
        email: '$userData.email',
        phone_number: '$userData.phone_number',
      },
    },
    { $sort: { created_at: -1 } },
  ];

  if (count) {
    pipeline.push({
      $count: 'total',
    });
  }
  if (extraParams) {
    if (extraParams.skip) pipeline.push({ $skip: Number(extraParams.skip) });
    if (extraParams.limit) pipeline.push({ $limit: Number(extraParams.limit) });
  }
  return pipeline;
};

export const getPipelineForOrderDetails = (chef_id, order_number) => {
  logger.log(level.info, `>> getPipelineForOrderDetails()`);
  let pipeline = [
    { $match: { chef_id, is_deleted: false, order_number } },
    {
      $lookup: {
        from: 'users',
        localField: 'user_id',
        foreignField: 'user_id',
        as: 'userData',
      },
    },
    { $unwind: '$userData' },
    {
      $project: {
        billing_address: 1,
        shipping_address: 1,
        is_deleted: 1,
        amount_discount: 1,
        order_number: 1,
        payment_intent: 1,
        user_id: 1,
        refunded: 1,
        chef_id: 1,
        receipt_url: 1,
        total_amount: 1,
        status: 1,
        portfolios: 1,
        created_at: 1,
        firstname: '$userData.firstname',
        lastname: '$userData.lastname',
        email: '$userData.email',
        phone_number: '$userData.phone_number',
      },
    },
  ];
  return pipeline;
};

export const getRefundOrderList = (chef_id, extraParams, count) => {
  logger.log(level.info, `>> getRefundOrderList()`);
  let pipeline = [
    { $match: { chef_id } },
    {
      $lookup: {
        from: 'users',
        localField: 'user_id',
        foreignField: 'user_id',
        as: 'userData',
      },
    },
    { $unwind: '$userData' },
    {
      $project: {
        order_number: 1,
        refund_id: 1,
        total_amount: 1,
        status: 1,
        amount_discount: 1,
        created_at: 1,
        firstname: '$userData.firstname',
        lastname: '$userData.lastname',
        email: '$userData.email',
        user_status: '$userData.status',
      },
    },
  ];

  if (count) {
    pipeline.push({
      $count: 'total',
    });
  }
  if (extraParams) {
    if (extraParams.skip) pipeline.push({ $skip: Number(extraParams.skip) });
    if (extraParams.limit) pipeline.push({ $limit: Number(extraParams.limit) });
  }

  return pipeline;
};

export const getRefundOrderDetails = (chef_id, refund_id) => {
  logger.log(level.info, `>> getRefundOrderDetails()`);
  let pipeline = [
    { $match: { chef_id, refund_id } },
    {
      $lookup: {
        from: 'orders',
        localField: 'order_number',
        foreignField: 'order_number',
        as: 'orderData',
      },
    },
    { $unwind: '$orderData' },
    {
      $lookup: {
        from: 'users',
        localField: 'user_id',
        foreignField: 'user_id',
        as: 'userData',
      },
    },
    { $unwind: '$userData' },
    {
      $project: {
        order_number: 1,
        refund_id: 1,
        total_amount: 1,
        amount_discount: 1,
        created_at: 1,
        status: 1,
        firstname: '$userData.firstname',
        lastname: '$userData.lastname',
        email: '$userData.email',
        user_status: '$userData.status',
        billing_address: '$orderData.billing_address',
        shipping_address: '$orderData.shipping_address',
        refunded: '$orderData.refunded',
        portfolios: '$orderData.portfolios',
        refund_invoice_url: '$orderData.refund_invoice_url',
      },
    },
  ];
  return pipeline;
};

export const getBookedOrderList = (chef_id, extraParams, count) => {
  logger.log(level.info, `>> getBookedOrderList()`);
  let pipeline = [
    { $match: { chef_id } },
    { $unwind: '$not_working_dates.booked_dates' },
    {
      $lookup: {
        from: 'users',
        localField: 'not_working_dates.booked_dates.user_id',
        foreignField: 'user_id',
        as: 'userData',
      },
    },
    { $unwind: '$userData' },
    {
      $lookup: {
        from: 'portfolios',
        localField: 'not_working_dates.booked_dates.portfolio_id',
        foreignField: 'portfolio_id',
        as: 'portfolioData',
      },
    },
    { $unwind: '$portfolioData' },
    {
      $project: {
        status: '$not_working_dates.booked_dates.status',
        date: '$not_working_dates.booked_dates.date',
        people: '$not_working_dates.booked_dates.people',
        firstname: '$userData.firstname',
        lastname: '$userData.lastname',
        email: '$userData.email',
        phone_number: '$userData.phone_number',
        portfolio_name: '$portfolioData.portfolio_name',
        recipeAndTime: '$portfolioData.recipeAndTime',
      },
    },
    { $match: { $or: [{ status: 1 }, { status: 2 }, { status: 3 }] } },
    { $sort: { date: 1 } },
  ];

  if (count) {
    pipeline.push({
      $count: 'total',
    });
  }
  if (extraParams) {
    if (extraParams.skip) pipeline.push({ $skip: Number(extraParams.skip) });
    if (extraParams.limit) pipeline.push({ $limit: Number(extraParams.limit) });
  }

  return pipeline;
};
