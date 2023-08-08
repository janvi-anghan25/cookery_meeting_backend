/**
 * * Admin Routes
 */

import { Router } from 'express';
const routes = new Router();
import { constants as VALIDATOR } from '../../constant/validator/admin';
import { validate } from '../../validator/admin/admin.validator';
import * as adminCtrl from '../../controllers/admin/admin.controller';
import { adminAuthMiddleware } from '../../middleware/authentication';

import packageRoutes from './package.routes';
import purchaseRoutes from './purchase.routes';
import recipeOptionsRoutes from './recipe_options.routes';
import configRoutes from './config.routes';
import couponRoutes from './coupon.routes';
import promoCodeRoutes from './promoCode.routes';
import dashboardRoutes from './dashboard.routes';
import feedbackRoutes from './feedback.routes';
import contactUsRoutes from './contact_us.routes';
import faqRoutes from './faq.routes';

const PATH = {
  ROOT: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  VERIFY_EMAIL: '/email_verification/:verification_token',
  VERIFY_ADMIN: '/verification',
  FORGOT_PASSWORD: '/forgot_password/email/:email',
  PASSWORD_RESET: '/password_reset/email/:email/token/:token',
  CHANGE_PASSWORD_OTP: '/change_password_otp',
  CHANGE_PASSWORD: '/change_password',
  CONFIG: '/config',
  MY_ACCOUNT: '/me',
  PACKAGE: '/package',
  PROMO_CODE: '/promocode',
  PURCHASED: '/package_purchase',
  RECIPE_OPTIONS: '/recipe_options',
  COUPON: '/coupon',
  DASHBOARD: '/dashboard',
  FEEDBACK: '/feedback',
  CONTACT_US: '/contact',
  FAQ: '/faq',
};

/**
 * * FAQ Routes
 */
routes.use(PATH.FAQ, faqRoutes);

/**
 * * Contact Routes
 */
routes.use(PATH.CONTACT_US, contactUsRoutes);

/**
 * * Feedback Routes
 */
routes.use(PATH.FEEDBACK, feedbackRoutes);

/**
 * * Dashboard Routes
 */
routes.use(PATH.DASHBOARD, dashboardRoutes);

/**
 * * Package Routes
 */
routes.use(PATH.PACKAGE, packageRoutes);

/**
 * * Promo Code Routes
 */
routes.use(PATH.PROMO_CODE, promoCodeRoutes);

/**
 * * Purchase Routes
 */
routes.use(PATH.PURCHASED, purchaseRoutes);

/**
 * * Recipe Options Routes
 */
routes.use(PATH.RECIPE_OPTIONS, recipeOptionsRoutes);

/**
 * * Config Routes
 */
routes.use(PATH.CONFIG, configRoutes);

/**
 * * Coupon Routes
 */
routes.use(PATH.COUPON, couponRoutes);
/**
 * @api {POST} /api/admin/signup?platform=app
 * @desc New Admin Register API
 * @access Using Secret
 * **/
routes.post(
  PATH.SIGNUP,
  validate(VALIDATOR.ADMIN_SIGNUP),
  adminCtrl.adminSignup
);

/**
 * @api {GET} /api/admin/email_verification/:verification_token
 * @desc  Store Owner Email Verify API
 * @access Public
 * **/
routes.get(PATH.VERIFY_EMAIL, adminCtrl.verifyAdmin);

/**
 * @api {POST} /api/admin/verification
 * @desc  ADMIN Verify using O
 * TP API
 * @access Public
 * **/
routes.post(PATH.VERIFY_ADMIN, adminCtrl.verifyOTP);

/**
 * @api {POST} /api/admin/login
 * @desc Admin Login API
 * @access Public
 * **/
routes.post(PATH.LOGIN, validate(VALIDATOR.ADMIN_LOGIN), adminCtrl.adminLogin);

/**
 * @api {GET} /api/admin/forgot_password/email/:email
 * @desc Admin Forget Password API
 * @access Public
 * **/
routes.get(
  PATH.FORGOT_PASSWORD,
  validate(VALIDATOR.ADMIN_FORGOT_PASSWORD),
  adminCtrl.adminForgotPassword
);

/**
 * @api {POST} /api/admin/change_password
 * @desc Admin RESET Password API
 * @access Public
 * **/
routes.post(
  PATH.CHANGE_PASSWORD,
  validate(VALIDATOR.ADMIN_CHANGE_PASSWORD),
  adminCtrl.adminChangePassword
);

/**
 * @api {POST} /api/admin/change_password_otp
 * @desc Admin RESET Password API from app
 * @access Public
 * **/
routes.post(
  PATH.CHANGE_PASSWORD_OTP,
  validate(VALIDATOR.CHANGE_PASSWORD_OTP),
  adminCtrl.changePasswordOtp
);

/**
 * @api {GET} /api/admin
 * @desc Get All Admins API
 * @access Using Secret
 * **/
// routes.get(PATH.ROOT, validate(VALIDATOR.GET_ADMIN), allAdmins);

/**
 * @desc Admin Auth Middleware: Use for authenticate adminuser routes
 * **/
routes.use(adminAuthMiddleware);

/**
 * @api {get} /api/admin/me
 * @desc  My Admin account
 * @access Private
 * **/

routes
  .route(PATH.MY_ACCOUNT)
  .get(adminCtrl.myAdminAccount)

  /**
   * @api {PUT} /api/admin/me
   * @desc Update My Account
   * @access Private
   * **/
  .put(validate(VALIDATOR.UPDATE_ACCOUNT), adminCtrl.updateAdminAccount);

export default routes;
