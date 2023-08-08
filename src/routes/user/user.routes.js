/**
 * * User Routes
 */

import { Router } from 'express';
import {
  registerUser,
  verifyUser,
  loginUser,
  forgotPassword,
  changePassword,
  changePasswordOtp,
  myAccount,
  updateMyAccount,
  verifyOTP,
} from '../../controllers/user/user.controller';
import * as messageController from '../../controllers/chef/message.controller';

import { appAuthMiddleware } from '../../middleware/authentication';
import { validate } from '../../validator/user.validator';
import { constants as VALIDATOR } from '../../constant/validator/user.js';

const routes = new Router({ mergeParams: true });
import portfolioRoutes from './portfolio.routes';
import recipeRoutes from './recipe.routes';
import cartRoutes from './cart.routes';
import chefRoutes from './chef.routes';
import orderRoutes from './order.routes';
import feedbackRoutes from './feedback.routes';
import contactUsRoutes from './contact_us.routes';
import qnaRoutes from './qna.routes';
import faqRoutes from './faq.routes';

const PATH = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  VERIFY_EMAIL: '/email_verification/:verification_token',
  VERIFY_USER: '/verification',
  FORGOT_PASSWORD: '/forgot_password/email/:email',
  CHANGE_PASSWORD: '/change_password',
  CHANGE_PASSWORD_OTP: '/change_password_otp',
  SEND_VERIFICATION: '/send_email_verification/:email',
  MY_ACCOUNT: '/me',
  ACCOUNT: '/account',
  PROFILE: '/profile',
  ROOT: '/',
  PORTFOLIO: '/portfolio',
  RECIPE: '/recipe',
  CHEF: '/chef',
  CART: '/cart',
  ORDER: '/order',
  FEEDBACK: '/feedback',
  CONTACT_US: '/contact_us',
  QNA: '/qna',
  FAQ: '/faq',
  MESSAGE: '/message',
  ROOM: '/room',
  ADD_ROOM: '/add_room',
};

/**
 * * FAQ Routes
 */
routes.use(PATH.FAQ, faqRoutes);

/**
 * * QNA Routes
 */
routes.use(PATH.QNA, qnaRoutes);

/**
 * * Contact Routes
 */
routes.use(PATH.CONTACT_US, contactUsRoutes);

/**
 * * Feedback Routes
 */
routes.use(PATH.FEEDBACK, feedbackRoutes);

/**
 * * Portfolio Routes
 */
routes.use(PATH.PORTFOLIO, portfolioRoutes);

/**
 * * Recipe Routes
 */
routes.use(PATH.RECIPE, recipeRoutes);

/**
 * * Chef Routes
 */
routes.use(PATH.CHEF, chefRoutes);

/**
 * * Cart Routes
 */
routes.use(PATH.CART, cartRoutes);

/**
 * * Order Purchase Routes
 */
routes.use(PATH.ORDER, orderRoutes);

/**
 * @api {GET} /api/user/message
 * @desc Get Messages API
 * @access Public
 * **/
routes.get(PATH.MESSAGE, messageController.getMessages);

/**
 * @api {PUT} /api/user/room
 * @desc Update Room API
 * @access Public
 * **/
routes.put(PATH.ROOM, messageController.updateRoom);

/**
 * @api {POST} /api/user/room
 * @desc Update Room API
 * @access Public
 * **/
routes.post(PATH.ADD_ROOM, messageController.addRoom);

/**
 * @api {POST} /api/user/signup
 * @desc New User Register API
 * @access Public
 * **/
routes.post(PATH.SIGNUP, validate(VALIDATOR.REGISTER_USER), registerUser);

/**
 * @api {POST} /api/user/login
 * @desc User Login API
 * @access Public
 * **/
routes.post(PATH.LOGIN, validate(VALIDATOR.LOGIN_USER), loginUser);

/**
 * @api {GET} /api/user/email_verification/:verification_token
 * @desc User Email Verify API
 * @access Public
 * **/
routes.get(PATH.VERIFY_EMAIL, verifyUser);

/**
 * @api {POST} /api/user/verification
 * @desc  ADMIN Verify using OTP API
 * @access Public
 * **/
routes.post(PATH.VERIFY_USER, verifyOTP);

/**
 * @api {GET} /api/user/forgot_password/email/:email
 * @desc User Forget Password API
 * @access Public
 * **/
routes.get(
  PATH.FORGOT_PASSWORD,
  validate(VALIDATOR.FORGOT_PASSWORD),
  forgotPassword
);

/**
 * @api {POST} /api/user/change_password
 * @desc User Reset Password API
 * @access Public
 * **/
routes.post(
  PATH.CHANGE_PASSWORD,
  validate(VALIDATOR.CHANGE_PASSWORD),
  changePassword
);

/**
 * @api {POST} /api/user/change_password_otp
 * @desc USER RESET Password API from app
 * @access Public
 * **/
routes.post(
  PATH.CHANGE_PASSWORD_OTP,
  validate(VALIDATOR.CHANGE_PASSWORD_OTP),
  changePasswordOtp
);

// /**
//  * @api {GET} /api/user/email_verification/:email
//  * @desc Resend verifiaction Mail
//  * @access Public
//  * **/

// routes.get(
//   PATH.SEND_VERIFICATION,
//   validate(VALIDATOR.SEND_VERIFICATION),
//   resendVerificationMail
// );

routes.use(appAuthMiddleware);

routes
  .route(PATH.MY_ACCOUNT)

  /**
   * @api {GET} /api/user/me
   * @desc Get my cart
   * @access Private
   * **/
  .get(myAccount)

  /**
   * @api {PUT} /api/user/edit_profile
   * @desc update user
   * @access Private
   * **/
  .put(updateMyAccount);

export default routes;
