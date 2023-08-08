import { logger, level } from '../../config/logger';
import MessageModel from '../../models/messages';
import userModel from '../../models/user';
import chefModel from '../../models/chef';
import roomModel from '../../models/room';

export const getMessages = async (query) => {
  logger.log(level.debug, `>> getMessages`);

  let data = {};
  let messageData = await MessageModel.get({ room: query.room }, '-users');
  if (messageData && messageData.length > 0) {
    data = {
      data: messageData,
    };
  } else {
    data = {
      data: [],
    };
  }
  return data;
};

export const getAllUsers = async () => {
  logger.log(level.info, `>> getAllUsers ()`);
  const userData = await userModel.aggregate([
    { $match: { status: 1 } },
    {
      $lookup: {
        from: 'orders',
        localField: 'user_id',
        foreignField: 'user_id',
        as: 'orderData',
      },
    },
  ]);
  const data = {
    message: 'succ_303',
    data: userData,
  };
  return data;
};

export const updateRoom = async (query) => {
  logger.log(level.info, `>> updateRoom ()`);

  let { chef_id, user_id } = query;

  let roomData = await roomModel.get({
    $and: [{ chef_id: chef_id }, { user_id: user_id }],
  });

  if (roomData && roomData.length <= 0) {
    let addedRoom = await roomModel.add({
      chef_id,
      user_id,
    });
    let data = {
      message: 'succ_301',
      data: [addedRoom],
    };
    return data;
  } else {
    let data = {
      message: 'succ_302',
      data: roomData,
    };
    return data;
  }
};

export const getAllChefs = async () => {
  logger.log(level.info, `>> getAllChefs ()`);
  const chefData = await chefModel.aggregate([
    { $match: { status: 1, publish_account: true } },
    {
      $lookup: {
        from: 'orders',
        localField: 'chef_id',
        foreignField: 'chef_id',
        as: 'orderData',
      },
    },
  ]);
  const data = {
    message: 'succ_131',
    data: chefData,
  };
  return data;
};

export const addRoom = async (body) => {
  logger.log(level.info, `>> addRoom()`);
  const { chef_id, user_id } = body;

  const roomData = await roomModel.get({
    $and: [{ chef_id: chef_id }, { user_id: user_id }],
  });

  if (roomData && roomData.length === 0) {
    const addedData = await roomModel.add({ chef_id, user_id });
    const data = {
      message: 'succ_301',
      data: [addedData],
    };
    return data;
  } else {
    const data = {
      message: 'succ_301',
      data: roomData,
    };
    return data;
  }
};

export const getRoom = async (query) => {
  logger.log(level.info, `>> getRoom()`);

  let { room_id } = query;
  let pipeline = roomPipeline(room_id);
  let roomData = await roomModel.aggregate(pipeline);
  const data = {
    message: 'succ_304',
    data: roomData,
  };
  return data;
};

const roomPipeline = (room_id) => {
  let pipeline = [
    { $match: { room_id } },
    {
      $lookup: {
        from: 'chefs',
        localField: 'chef_id',
        foreignField: 'chef_id',
        as: 'chefData',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user_id',
        foreignField: 'user_id',
        as: 'userData',
      },
    },
    { $unwind: '$chefData' },
    { $unwind: '$userData' },
    {
      $project: {
        room_id: 1,
        chef_id: 1,
        user_id: 1,
        chef_name: '$chefData.firstname',
        user_name: '$userData.firstname',
        chef_lastname: '$chefData.lastname',
        user_lastname: '$userData.lastname',
        chef_profile: '$chefData.profile_image',
        user_profile: '$userData.profile_image',
        order_id: 1,
      },
    },
  ];
  return pipeline;
};
