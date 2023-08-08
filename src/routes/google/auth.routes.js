// /**
//  * Google Auth Routes
//  */

// import { Router } from "express";
// import {
//   // requireGoogleLogin,
//   authGoogle,
//   authGoogleRedirect,
// } from "../../services/google/login";
// import { constants as GOOGLE_ROUTES_CONST } from "../../constant/google/routes";
// import JWTAuth from "../../services/jwt_auth/jwt_auth";

// // import { redirectRequest } from "../../utils/utility";

// const routes = new Router();
// /**
//  * change redirect url when frontend setup
//  */
// const REDIRECT_URL = "/api/user/account";

// routes.get(
//   GOOGLE_ROUTES_CONST.AUTH,
//   // requireGoogleLogin,
//   authGoogle,
//   (_req, _res) => {
//     // The request will be redirected to Google for authentication, so this
//     // function will not be called.
//   }
// );

// // GET /auth/facebook/callback
// //   Use passport.authenticate() as route middleware to authenticate the
// //   request.  If authentication fails, the user will be redirected back to the
// //   login page.  Otherwise, the primary rout function will be called,
// //   which, in this example, will redirect the user to the home page.

// /**
//  * old code
//  */
// // routes.get(GOOGLE_ROUTES_CONST.AUTH_CALLBACK, authGoogleRedirect, (_, res) => {
// //   redirectRequest(res, REDIRECT_URL);
// // });

// /**
//  * new code: if it works then refactor code
//  */
// routes.get(
//   GOOGLE_ROUTES_CONST.AUTH_CALLBACK,
//   authGoogleRedirect,
//   async (req, res) => {
//     // redirectRequest(res, REDIRECT_URL);
//     const auth = new JWTAuth();
//     const tokenPayload = {
//       id: req.user.id,
//       email: req.user.email,
//     };
//     const accessToken = await auth.createToken(tokenPayload);
//     // res.set("Authorization", `Bearer ${accessToken}`);
//     return res
//       .status(200)
//       .cookie(accessToken, {
//         httpOnly: true,
//       })
//       .redirect(REDIRECT_URL + `?token=${accessToken}`);
//     // redirectRequest(res, REDIRECT_URL);
//   }
// );

// export default routes;
