import { query } from 'express-validator';
import { constants as VALIDATOR } from '../../constant/validator/chef';
import chefModel from '../../models/chef';

export const validate = (method) => {
  let error = [];
  switch (method) {
    case VALIDATOR.CHEF_ID: {
      error = [query('chef_id', 'err_59').not().isEmpty().custom(chefExist)];
      break;
    }
  }
  return error;
};

const chefExist = async (value) => {
  let isChefExist = await chefModel.isExist({ chef_id: value });
  if (!isChefExist) {
    throw new Error('err_60');
  }
  return value;
};
