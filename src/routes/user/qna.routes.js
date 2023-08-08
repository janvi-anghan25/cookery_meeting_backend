/**
 * * Chef QNA Routes
 */

import { Router } from 'express';
import * as qnaController from '../../controllers/user/portfolio_qna.controller';

import { appAuthMiddleware } from '../../middleware/authentication';
import { validate } from '../../validator/user/portfolio.validator';
import { constants as VALIDATOR } from '../../constant/validator/portfolio';

const routes = new Router({ mergeParams: true });

const PATH = {
  ROOT: '/',
  LIST: '/list',
  ADD: '/add/question',
};

routes.use(appAuthMiddleware);

/**
 * @api {POST} /api/chef/qna/add
 * @desc Add QNA
 * @access Private
 * **/

routes.post(
  PATH.ADD,
  validate(VALIDATOR.ADD_QUESTION),
  qnaController.addQuestion
);

/**
 * @api {GET} /api/user/qna
 * @desc Get All QNA
 * @access Private
 * **/

routes.get(
  PATH.ROOT,
  validate(VALIDATOR.PORTFOLIO_ID),
  qnaController.getAllQNA
);

export default routes;
