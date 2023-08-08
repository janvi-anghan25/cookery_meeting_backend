// /**
//  * Facebook Auth Routes
//  */

// import { Router } from "express";
// import {
//   // requireFacebookLogin,
//   authFacebook,
//   authFacebookRedirect,
// } from "../../services/facebook/login";
// import { constants as FACEBOOK_ROUTES_CONST } from "../../constant/facebook/routes";
// import { redirectRequest } from "../../utils/utility";

// const routes = new Router();
// /**
//  * change redirect url when frontend setup
//  */
// const REDIRECT_URL = "/api/user/account";

// routes.get(
//     FACEBOOK_ROUTES_CONST.AUTH,
//   // requireGoogleLogin,
//   authFacebook,
//   (_req, _res) => {
//     // The request will be redirected to Facebook for authentication, so this
//     // function will not be called.
//   }
// );

// // GET /auth/facebook/callback
// //   Use passport.authenticate() as route middleware to authenticate the
// //   request.  If authentication fails, the user will be redirected back to the
// //   login page.  Otherwise, the primary rout function will be called,
// //   which, in this example, will redirect the user to the home page.
// routes.get(FACEBOOK_ROUTES_CONST.AUTH_CALLBACK, authFacebookRedirect, (_, res) => {
//   redirectRequest(res, REDIRECT_URL);
// });

// export default routes;
