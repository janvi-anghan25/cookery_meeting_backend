import sendGridMail from '@sendgrid/mail';
import { logger, level } from '../config/logger';
import { constants as SENDGRID_CONST } from '../constant/sendgrid';

sendGridMail.setApiKey(SENDGRID_CONST.SENDGRID_API_KEY);

const sendGrid = async (msg) => {
  sendGridMail.send(msg, (err, _res) => {
    if (err) throw { err };
    else {
      logger.log(level.debug, `Email sent successfully.`);
    }
  });
};

export default sendGrid;
