import httpContext from 'express-http-context';
import { logger, level } from '../config/logger';
import JWTAuth from '../services/jwt_auth/jwt_auth';
import { authError } from '../utils/utility';
import adminUserModel from '../models/admin';
import userModel from '../models/user';
import chefModel from '../models/chef';

const auth = new JWTAuth();
const tokenLength = 2;
const AUTH_TYPE = 'bearer';
const tokenSplitBy = ' ';
const AUTHORIZATION_HEADER_NAME = 'authorization';
const CURRENT_ADMIN_USER = 'currentAdminUser';
const CURRENT_USER = 'currentUser';
const CURRENT_Chef = 'currentChef';

export const adminAuthMiddleware = async (req, res, next) => {
  const authorization = req.headers[AUTHORIZATION_HEADER_NAME];
  if (authorization) {
    let token = authorization.split(tokenSplitBy);
    let length = token.length;
    if (length == tokenLength && token[0].toLowerCase() == AUTH_TYPE) {
      let accessToken = token[1];
      try {
        let decoded = await auth.verifyToken(accessToken);
        logger.log(
          level.debug,
          `adminAuthMiddleware decoded=${JSON.stringify(decoded)}`
        );
        // TO-DO decoded.data.email decoded.data.admin
        const adminUser = decoded.data;

        const [adminUserDoc] = await adminUserModel.get({
          email: adminUser.email,
        });

        if (adminUserDoc && adminUserDoc.status === 1) {
          httpContext.set('email', adminUser.email);
          /* eslint-disable require-atomic-updates */
          req[CURRENT_ADMIN_USER] = adminUser;
          next();
          return;
        } else {
          logger.log(
            level.debug,
            `adminAuthMiddleware
            decoded=${JSON.stringify(decoded)},
            adminUserDoc=${JSON.stringify(adminUserDoc)}`
          );
        }
      } catch (e) {
        logger.log(level.error, `adminAuthMiddleware ${e}`);
      }
    }
  }
  authError(res);
};

// change data sending and remove role from token
export const appAuthMiddleware = async (req, res, next) => {
  const authorization = req.headers[AUTHORIZATION_HEADER_NAME];
  if (authorization) {
    let token = authorization.split(tokenSplitBy);
    let length = token.length;
    if (length == tokenLength && token[0].toLowerCase() === AUTH_TYPE) {
      let accessToken = token[1];
      try {
        let decoded = await auth.verifyToken(accessToken);
        logger.log(
          level.debug,
          `appAuthMiddleware decoded=${JSON.stringify(decoded)}`
        );
        let user = decoded.data;
        const [userDoc] = await userModel.get({
          email: user.email,
        });
        if (userDoc && userDoc.status === 1) {
          httpContext.set('email', user.email);
          // let fullname = `${userDoc.firstname} ${userDoc.lastname}`;
          user = {
            id: userDoc._id,
            email: userDoc.email,
            role: userDoc.role,
            user_id: userDoc.user_id,
            // name: fullname,
          };

          /* eslint-disable require-atomic-updates */
          req[CURRENT_USER] = user;
          next();
          return;
        } else {
          logger.log(
            level.debug,
            `appAuthMiddleware
            decoded=${JSON.stringify(decoded)},
            userDoc=${JSON.stringify(userDoc)}`
          );
        }
      } catch (e) {
        logger.log(level.error, `appAuthMiddleware ${e}`);
        // code = HTTPStatus.BAD_REQUEST;
        // response = createErrorResponseJSON(1, e);
      }
    }
  }
  authError(res);
};

export const chefAuthMiddleware = async (req, res, next) => {
  const authorization = req.headers[AUTHORIZATION_HEADER_NAME];
  if (authorization) {
    let token = authorization.split(tokenSplitBy);
    let length = token.length;
    if (length == tokenLength && token[0].toLowerCase() === AUTH_TYPE) {
      let accessToken = token[1];
      try {
        let decoded = await auth.verifyToken(accessToken);
        logger.log(
          level.debug,
          `chefAuthMiddleware decoded=${JSON.stringify(decoded)}`
        );
        let chef = decoded.data;
        const [chefDoc] = await chefModel.get({
          email: chef.email,
        });

        if (chefDoc && chefDoc.status === 1) {
          httpContext.set('email', chef.email);
          // let fullname = `${chefDoc.firstname} ${chefDoc.lastname}`;
          chef = {
            id: chefDoc._id,
            email: chefDoc.email,
            role: chefDoc.role,
            chef_id: chefDoc.chef_id,
            name: chefDoc.firstname,
            country_code: chefDoc.country_code,
          };

          /* eslint-disable require-atomic-updates */
          req[CURRENT_Chef] = chef;
          next();
          return;
        } else {
          logger.log(
            level.debug,
            `chefAuthMiddleware
            decoded=${JSON.stringify(decoded)},
            chefDoc=${JSON.stringify(chefDoc)}`
          );
        }
      } catch (e) {
        logger.log(level.error, `chefAuthMiddleware ${e}`);
        // code = HTTPStatus.BAD_REQUEST;
        // response = createErrorResponseJSON(1, e);
      }
    }
  }
  authError(res);
};
