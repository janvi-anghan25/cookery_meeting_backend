import httpContext from 'express-http-context';
import './config/database';
import middlewaresConfig from './config/middlewares';
import { logger, level } from './config/logger';
import express from 'express';
import bodyParser from 'body-parser';
import { constants as APP_CONST } from './constant/application';
import ApiRoutes from './routes';
import { Server } from 'http';
import socketIOConfig from './services/socketIO/socketIO';
import * as webhookService from './services/stripe/webhook';
import './cron-jobs';

const app = express();

const PATH = {
  API: '/api',
  WEBHOOK: '/webhook-checkout',
};

// ! Call Webhook before app.use(bodyParser.json());
app.post(
  PATH.WEBHOOK,
  bodyParser.raw({ type: 'application/json' }),
  webhookService.webhook
);

// app.set('view engine', 'pug');
// Wrap all the middlewares with the server
middlewaresConfig(app);

app.use('/static', express.static(APP_CONST.PUBLIC_PATH));
app.use(httpContext.middleware);
// fs.mkdirSync(APP_CONST.PRODUCT_IMAGE_PATH, { recursive: true });

const server = Server(app);
socketIOConfig(server);

// Add the apiRoutes stack to the server
app.use(PATH.API, ApiRoutes);

server.listen(APP_CONST.PORT, (err) => {
  if (err) {
    logger.log(level.error, `Cannot run due to ${err}!`);
  } else {
    logger.log(level.info, `server started on port ${APP_CONST.PORT}`);
  }
});

export default app;
