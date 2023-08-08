// import passport from "passport";
// import { Strategy as FacebookStrategy } from "passport-facebook";
// // import JWTAuth from '../jwt_auth/jwt_auth';
// import HTTPStatus from "http-status";
// import { logger, level } from "../../config/logger";
// import { constants as API_URL_CONST } from "../../constant/api_url";
// import { constants as FACEBOOK_CRED_CONST } from "../../constant/facebook/credential";
// import { constants as ERROR_CONST } from "../../constant/error";
// import { sendJSONResponse, createErrorResponseJSON } from "../../utils/utility";
// import userModel from "../../models/user";
// // const userModel = new User();


// const EMAIL = "email";
// const ERROR_500_MESSAGE = ERROR_CONST.ERROR_500_MESSAGE;

// const serializeUserFunction = (user, done) => {
//   logger.log(level.info, `SerializeUser ${JSON.stringify(user)}`);
//   done(null, user);
// };

// // passport setting
// passport.serializeUser(serializeUserFunction);

// const deserializeUserFunction = (obj, done) => {
//   logger.log(level.info, `DeserializeUser ${JSON.stringify(obj)}`);
//   done(null, obj);
// };

// passport.deserializeUser(deserializeUserFunction);

// // const callbackURL = API_URL_CONST.HOST_URL + FB_CRED_CONST.CALLBACK_URL;
// const callbackURL = API_URL_CONST.HOST_URL + FACEBOOK_CRED_CONST.CALLBACK_URL;
// const option = {
//   clientID: FACEBOOK_CRED_CONST.FACEBOOK_CLIENT_ID,
//   clientSecret: FACEBOOK_CRED_CONST.FACEBOOK_CLIENT_SECRET,
//   callbackURL,
//   profileFields: ["id", "displayName", "photos", "email"],
// };

// const verifyFunction = (token, tokenSecret, profile, done) => {
//   process.nextTick(async () => {
//     logger.log(
//       level.debug,
//       `>> verifyFunction ${JSON.stringify({ token, tokenSecret, profile })}`
//     );

//     let { familyName, givenName } = profile.name;
//     let { id, name, email } = profile._json;

//     try {
//       logger.log(
//         level.debug,
//         `>> verifyFunction ${JSON.stringify({ id, name })}`
//       );
//       const FACEBOOK_OAUTH = "facebook";
//       let user = {
//         email,
//         firstname: givenName,
//         lastname: familyName,
//         name,
//         oauth_provider: FACEBOOK_OAUTH,
//         picture: `https://graph.facebook.com/${id}/picture?type=large`,
//         verify: true,
//       };

//       const isUserExist = await userModel.isExist({ email });
//       if (isUserExist) {
//         const updatedUser = {
//           firstname: givenName,
//           lastname: familyName,
//           name,
//           picture: `https://graph.facebook.com/${id}/picture?type=large`,
//         };
//         await userModel.update({ email }, updatedUser);
//       } else {
//         await userModel.add(user);
//       }
//       logger.log(level.info, `verifyFunction email=${JSON.stringify(email)}`);
//       profile[EMAIL] = email;
//     } catch (e) {
//       logger.log(level.error, e);
//     }
//     return done(null, profile);
//   });
// };

// const facebookStrategy = new FacebookStrategy(option, verifyFunction);

// passport.use(facebookStrategy);

// const requireFacebookLogin = async (req, res, next) => {
//   logger.log(level.info, `requireFacebookLogin`);
//   const fb_access_token = req.query.fb_access_token;
//   if (fb_access_token) {
//     try {
//       let [accessTokenMatchedUser] = await userModel.get({
//         fb_access_token,
//       });
//       if (accessTokenMatchedUser) {
//         // const { email } = accessTokenMatchedUser;
//         // const fb = new UserAPI();
//         // let resp = await fb.debugUserAccessToken(fb_access_token);
//         // let result = JSON.parse(resp);
//         // const { is_valid, data_access_expires_at, expires_at } = result.data;
//         // let currentTimestamp = Math.floor(new Date() / 1000);
//         // TO-DO explore expiresAt property why it's 0?
//         // logger.log(
//         //   level.info,
//         //   `authFacebook email=${email} isValid=${is_valid}
//         //   currentTimestamp=${currentTimestamp}
//         //   dataAccessExpireAt=${data_access_expires_at}
//         //   expiresAt=${expires_at}
//         //   Facebook Login Required=${!is_valid &&
//         //     currentTimestamp > data_access_expires_at}
//         // `
//         // );
//         // if (is_valid && currentTimestamp < data_access_expires_at) {
//         //   const auth = new JWTAuth();
//         //   const accessToken = await auth.createToken(email);
//         //   logger.log(level.debug, `jwt token ${accessToken}`);
//         //   const redirectURLWithAcessToken =
//         //     REDIRECT_URL + `?${ACCESS_TOKEN}=${accessToken}`;
//         //   return redirectRequest(res, redirectURLWithAcessToken);
//         // }
//       }
//     } catch (e) {
//       let response, code;
//       logger.log(level.error, `error ${e}`);
//       code = HTTPStatus.INTERNAL_SERVER_ERROR;
//       response = createErrorResponseJSON(1, ERROR_500_MESSAGE);
//       return sendJSONResponse(res, code, response);
//     }
//   }
//   next();
// };

// const authFacebook = passport.authenticate(FACEBOOK_CRED_CONST.PROVIDER, {
//   authType: "reauthenticate", // If need to reauthenticate
//   scope: FACEBOOK_CRED_CONST.SCOPE,
//   failureRedirect: FACEBOOK_CRED_CONST.FAILURE_REDIRECT,
// });

// const authFacebookRedirect = passport.authenticate(
//   FACEBOOK_CRED_CONST.PROVIDER,
//   {
//     failureRedirect: FACEBOOK_CRED_CONST.FAILURE_REDIRECT,
//   }
// );

// export { requireFacebookLogin, authFacebook, authFacebookRedirect };
