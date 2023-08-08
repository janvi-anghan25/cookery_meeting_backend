import { logger, level } from '../../config/logger';
import {
  badRequestError,
  serverError,
  successResponse,
} from '../../utils/utility';
import * as promoRepo from '../../repositories/chef/promo';
import { validationResult } from 'express-validator';

export const applyPromo = async (req, res) => {
  logger.log(level.debug, `>> applyPromo()`);
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }

    let appliedPromoData = await promoRepo.applyPromo(
      req.body,
      req.currentChef,
      req.query
    );
    if (appliedPromoData.error) {
      return badRequestError(res, appliedPromoData.message);
    }
    successResponse(res, appliedPromoData);
  } catch (error) {
    logger.log(level.error, `<< applyPromo error= ${error}`);
    serverError(res);
  }
};
