/**
 * Create the winston logger instance
 */

import { createLogger, format, transports } from 'winston';
const { combine, timestamp, label, printf, colorize } = format;
const WinstonCloudWatch = require('winston-cloudwatch');

// TO-DO create separate file for constant if need to add more constant
const LOG_LABEL = 'COOKERY_MEETING';
const LOG_TIMEZONE = 'Asia/Kolkata';
const LOCALE = 'en-US';
const LOG_STREAM_NAME = 'cookery_meeting_' + process.env.NODE_ENV;
const AWS_CW_REGION = process.env.AWS_CW_REGION;
const AWS_CW_ACCESS_KEY_ID = process.env.AWS_CW_ACCESS_KEY_ID;
const AWS_CW_SECRET_KEY = process.env.AWS_CW_SECRET_KEY;
const AWS_CW_LOG_RETENTION_IN_DAYS = process.env.AWS_CW_LOG_RETENTION_IN_DAYS;

const timezoned = () => {
  return new Date().toLocaleString(LOCALE, {
    timeZone: LOG_TIMEZONE,
  });
};

const customFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const combineFormat = combine(
  label({ label: LOG_LABEL }),
  timestamp({ format: timezoned }),
  colorize(true),
  customFormat
);

const transportsDetails = [];

if (process.env.IS_CONSOLE == 'true') {
  transportsDetails.push(
    new transports.Console({
      level: process.env.LOG_LEVEL,
      format: combineFormat,
      timestamp: function () {
        return new Date().toLocaleTimeString();
      },
    })
  );
} else if (process.env.IS_AWS_CLOUDWATCH == 'true') {
  transportsDetails.push(
    new WinstonCloudWatch({
      level: process.env.LOG_LEVEL,
      logGroupName: LOG_LABEL,
      logStreamName: LOG_STREAM_NAME,
      awsRegion: AWS_CW_REGION,
      awsAccessKeyId: AWS_CW_ACCESS_KEY_ID,
      awsSecretKey: AWS_CW_SECRET_KEY,
      retentionInDays: AWS_CW_LOG_RETENTION_IN_DAYS,
    })
  );
} else {
  transportsDetails.push(
    new transports.Console({
      level: process.env.LOG_LEVEL,
      format: combineFormat,
      timestamp: function () {
        return new Date().toLocaleTimeString();
      },
    })
  );
}
var logger = createLogger({
  transports: transportsDetails,
});

export default logger;
