/**
 * * Chef QNA Routes
 */

import { Router } from 'express';
import * as qnaController from '../../controllers/chef/portfolio_qna.controller';

import { chefAuthMiddleware } from '../../middleware/authentication';
import { validate } from '../../validator/chef/portfolio.validator';
import { constants as VALIDATOR } from '../../constant/validator/portfolio';

const routes = new Router({ mergeParams: true });

const PATH = {
  ROOT: '/',
  LIST: '/list',
  ADD: '/add',
  EDIT: '/edit',
  DELETE: '/delete',
};

routes.use(chefAuthMiddleware);

/**
 * @api {POST} /api/chef/qna/add
 * @desc Add QNA
 * @access Private
 * **/

routes.post(
  PATH.ADD,
  validate(VALIDATOR.ADD_QNA),
  qnaController.addQuestionAndAnswer
);

/**
 * @api {GET} /api/chef/qna
 * @desc Get All QNA
 * @access Private
 * **/

routes.get(
  PATH.ROOT,
  validate(VALIDATOR.PORTFOLIO_ID),
  qnaController.getAllQNA
);

/**
 * @api {PUT} /api/chef/qna
 * @desc Update Answer
 * @access Private
 * **/

routes.put(
  PATH.EDIT,
  validate(VALIDATOR.UPDATE_ANSWER),
  qnaController.updateAnswer
);

/**
 * @api {DELETE} /api/chef/qna
 * @desc Delete QNA
 * @access Private
 * **/

routes.delete(
  PATH.DELETE,
  validate(VALIDATOR.DELETE_QNA),
  qnaController.deleteQNA
);

export default routes;
