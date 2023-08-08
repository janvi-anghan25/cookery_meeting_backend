/**
 * * Chef Routes
 */

import { Router } from 'express';
import * as chefController from '../../controllers/chef/chef.controller';
import * as messageController from '../../controllers/chef/message.controller';
import { chefAuthMiddleware } from '../../middleware/authentication';
import { validate } from '../../validator/chef/chef.validator';
import { constants as VALIDATOR } from '../../constant/validator/chef';

import portfolioRoutes from './portfolio.routes';
import packageRoutes from '../chef/package.routes';
import purchaseRoutes from './purchase.routes';
import recipeOptionsRoutes from './recipe_options.routes';
import recipeRoutes from './recipe.routes';
import marketplaceRoutes from './stripe/marketplace.routes';
import timeSlotRoutes from './timeSlot.routes';
import invoiceRoutes from './invoice.routes';
import couponRoutes from './coupon.routes';
import orderRoutes from './order.routes';
import promoRoutes from './promo.routes';
import feedbackRoutes from './feedback.routes';
import contactUsRoutes from './contact_us.routes';
import ratingsRoutes from './ratings.routes';
import dashboardRoutes from './dashboard.routes';
import qnaRoutes from './qna.routes';

import { chefMiddleware } from '../../middleware/chef';

const routes = new Router({ mergeParams: true });

const PATH = {
  ROOT: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  VERIFY_EMAIL: '/email_verification/:verification_token',
  VERIFY_CHEF: '/verification',
  FORGOT_PASSWORD: '/forgot_password/email/:email',
  CHANGE_PASSWORD: '/change_password',
  CHANGE_PASSWORD_OTP: '/change_password_otp',
  MY_ACCOUNT: '/me',
  PACKAGE: '/package',
  PURCHASED: '/package_purchase',
  INVOICE: '/invoice',
  PORTFOLIO: '/portfolio',
  RECIPE_OPTIONS: '/recipe_options',
  RECIPE: '/recipe',
  STRIPE_MARKET_PLACE: '/stripe',
  PUBLISH_PROFILE: '/publish_profile',
  TIME_SLOT: '/time_slot',
  COUPON: '/coupon',
  ORDER: '/order',
  PROMO: '/promo',
  FEEDBACK: '/feedback',
  CONTACT_US: '/contact_us',
  RATINGS: '/ratings',
  DASHBOARD: '/dashboard',
  MESSAGE: '/message',
  QNA: '/qna',
  USER: '/user',
  ROOM: '/room',
  ALL_CHEF: '/all',
  ADD_ROOM: '/add_room',
};

/**
 * * QNA Routes
 */
routes.use(PATH.QNA, qnaRoutes);

/**
 * * Dashboard Routes
 */
routes.use(PATH.DASHBOARD, dashboardRoutes);

/**
 * * Ratings Routes
 * **/
routes.use(PATH.RATINGS, ratingsRoutes);

/**
 * * Contact Us Routes
 * **/
routes.use(PATH.CONTACT_US, contactUsRoutes);

/**
 * * Feedback Routes
 * **/
routes.use(PATH.FEEDBACK, feedbackRoutes);

/**
 * * Promo Routes
 * **/
routes.use(PATH.PROMO, promoRoutes);

/**
 * * Package Routes
 * **/
routes.use(PATH.PACKAGE, packageRoutes);

/**
 * * Purchase Routes
 */
routes.use(PATH.PURCHASED, purchaseRoutes);

/**
 * * Invoice Routes
 */
routes.use(PATH.INVOICE, invoiceRoutes);

/**
 * * Recipe Options Routes
 */
routes.use(PATH.RECIPE_OPTIONS, recipeOptionsRoutes);

/**
 * * Recipe Routes
 */
routes.use(PATH.RECIPE, recipeRoutes);

/**
 * * Portfolio Routes
 */
routes.use(PATH.PORTFOLIO, portfolioRoutes);

/**
 * * Stripe Market Place
 */
routes.use(PATH.STRIPE_MARKET_PLACE, marketplaceRoutes);

/**
 * * Time Slot Routes
 */
routes.use(PATH.TIME_SLOT, timeSlotRoutes);

/**
 * * Coupon Routes
 */
routes.use(PATH.COUPON, couponRoutes);

/**
 * * ORDER Routes
 */
routes.use(PATH.ORDER, orderRoutes);

/**
 * @api {POST} /api/chef/signup
 * @desc New chef Register API
 * @access Public
 * **/
routes.post(
  PATH.SIGNUP,
  validate(VALIDATOR.REGISTER_CHEF),
  chefController.registerChef
);

/**
 * @api {POST} /api/chef/login
 * @desc chef Login API
 * @access Public
 * **/
routes.post(
  PATH.LOGIN,
  validate(VALIDATOR.LOGIN_CHEF),
  chefController.loginChef
);

/**
 * @api {GET} /api/chef/email_verification/:verification_token
 * @desc chef Email Verify API
 * @access Public
 * **/
routes.get(PATH.VERIFY_EMAIL, chefController.verifyChef);

/**
 * @api {POST} /api/chef/verification
 * @desc  ADMIN Verify using OTP API
 * @access Public
 * **/
routes.post(PATH.VERIFY_CHEF, chefController.verifyOTP);

/**
 * @api {GET} /api/chef/forgot_password/email/:email
 * @desc chef Forget Password API
 * @access Public
 * **/
routes.get(
  PATH.FORGOT_PASSWORD,
  validate(VALIDATOR.FORGOT_PASSWORD),
  chefController.forgotPassword
);

/**
 * @api {POST} /api/chef/change_password
 * @desc chef Reset Password API
 * @access Public
 * **/
routes.post(
  PATH.CHANGE_PASSWORD,
  validate(VALIDATOR.CHANGE_PASSWORD),
  chefController.changePassword
);

/**
 * @api {POST} /api/chef/change_password_otp
 * @desc chef RESET Password API from app
 * @access Public
 * **/
routes.post(
  PATH.CHANGE_PASSWORD_OTP,
  validate(VALIDATOR.CHANGE_PASSWORD_OTP),
  chefController.changePasswordOtp
);

/**
 * @api {GET} /api/chef/message
 * @desc Get Messages API
 * @access Public
 * **/
routes.get(PATH.MESSAGE, messageController.getMessages);

/**
 * @api {GET} /api/chef/user
 * @desc Get All Users API
 * @access Public
 * **/
routes.get(PATH.USER, messageController.getAllUsers);

routes
  .route(PATH.ROOM)
  /**
   * @api {PUT} /api/chef/room
   * @desc Update Room API
   * @access Public
   * **/
  .put(messageController.updateRoom)
  /**
   * @api {Get} /api/chef/room
   * @desc Get Room API
   * @access Public
   * **/
  .get(messageController.getRoom);

/**
 * @api {GET} /api/chef/all
 * @desc Get All Chefs API
 * @access Public
 * **/
routes.get(PATH.ALL_CHEF, messageController.getAllChefs);

/**
 * @api {POST} /api/chef/add_room
 * @desc Add Room API
 * @access Public
 * **/
routes.post(PATH.ADD_ROOM, messageController.addRoom);

routes.use(chefAuthMiddleware);

routes
  .route(PATH.MY_ACCOUNT)

  /**
   * @api {GET} /api/chef/me
   * @desc Get my cart
   * @access Private
   * **/
  .get(chefController.myAccount)
  /**
   * @api {PUT} /api/chef/me
   * @desc update chef
   * @access Private
   * **/
  .put(chefController.updateMyAccount)
  /**
   * @api {DELETE} /api/chef/me
   * @desc Delete Account
   * @access Private
   * **/
  .delete(chefController.deleteMyAccount);

/**
 * @api {PUT} /api/chef/publish_profile
 * @desc Publish chef porfile
 * @access Private
 * **/
routes
  .route(PATH.PUBLISH_PROFILE)
  .put(chefMiddleware, chefController.updatePublishStatus);

export default routes;
