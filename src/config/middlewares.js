/**
 * Configuration of the server middlewares.
 */

import bodyParser from 'body-parser';
import morgan from 'morgan';
import passport from 'passport';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import session from 'cookie-session';
import { constants as APP_CONST } from '../constant/application';

const MORGAN_DEV_FORMAT = 'dev';

// const MORGAN_COMBINE_FORMAT = "combined";

export default (app) => {
  app.use(cors());
  app.options('*', cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(
    session({
      cookie: { maxAge: 60000 },
      secret: APP_CONST.SESSION_SECRET,
      signed: true,
      resave: true,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(morgan(MORGAN_DEV_FORMAT));
  app.use(fileUpload());
};
