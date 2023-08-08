import { level, logger } from '../../config/logger';

export const getPipelineForCouponData = (user_id) => {
  logger.log(level.info, `>> getPipelineForCouponData()`);
  let pipeline = [
    { $match: { user_id, status: 1 } },
    {
      $lookup: {
        from: 'coupons',
        localField: 'coupon_code',
        foreignField: 'coupon_code',
        as: 'couponData',
      },
    },
  ];
  return pipeline;
};

export const getPipelineForOrderDetails = (user_id, extraParams, count) => {
  logger.log(level.info, `>> getPipelineForOrderDetails()`);
  let pipeline = [
    {
      $match: {
        user_id,
        $and: [{ status: { $ne: 0 } }, { status: { $ne: 8 } }],
      },
    },
    {
      $lookup: {
        from: 'chefs',
        localField: 'chef_id',
        foreignField: 'chef_id',
        as: 'chefData',
      },
    },
    { $unwind: '$chefData' },
    {
      $project: {
        _id: 1,
        billing_address: 1,
        shipping_address: 1,
        is_deleted: 1,
        status: 1,
        order_number: 1,
        amount_discount: 1,
        user_id: 1,
        total_amount: 1,
        portfolios: 1,
        order_id: 1,
        created_at: 1,
        chef_firstname: '$chefData.firstname',
        chef_lastname: '$chefData.lastname',
        chef_profile_image: '$chefData.profile_image',
        email: '$chefData.email',
        chef_id: 1,
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

export const getPipelineForOrder = (user_id, order_number) => {
  logger.log(level.info, `>> getPipelineForOrder()`);
  let pipeline = [
    { $match: { user_id, is_deleted: false, order_number } },
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

export const getRefundDataPipeline = (user_id, refund_id) => {
  logger.log(level.info, `>> getRefundDataPipeline()`);
  let pipeline = [
    { $match: { user_id, refund_id } },
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
      $project: {
        total_amount: 1,
        discount_amount: 1,
        user_id: 1,
        order_number: 1,
        refund_id: 1,
        status: '$orderData.status',
        billing_address: '$orderData.billing_address',
        shipping_address: '$orderData.shipping_address',
        payment_intent: '$orderData.payment_intent',
        refunded: '$orderData.refunded',
        chef_id: '$orderData.chef_id',
        portfolios: '$orderData.portfolios',
        order_id: '$orderData.order_id',
        refund_invoice_url: '$orderData.refund_invoice_url',
      },
    },
  ];
  return pipeline;
};
