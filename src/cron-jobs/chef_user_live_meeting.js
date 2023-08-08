import { scheduleJob } from 'node-schedule';
import { logger, level } from '../config/logger';
import moment from 'moment-timezone';
import { constants as APP_CONST } from '../constant/application';
import { constants as SENDGRID_CONST } from '../constant/sendgrid';
import { constants as GOOGLE_CONST } from '../constant/google/credential';
import { google } from 'googleapis';
import sendGrid from '../utils/sendgrid';
import { encodeData } from '../utils/utility';

import chefTimeSlotModel from '../models/chef_time_slot';
import portfolioModel from '../models/portfolio';
import chefModel from '../models/chef';
import userModel from '../models/user';
import roomModel from '../models/room';

const { OAuth2 } = google.auth;

const oAuth2Client = new OAuth2(
  GOOGLE_CONST.CLIENT_ID,
  GOOGLE_CONST.CLIENT_SECRET
);

let credentials = {
  access_token: GOOGLE_CONST.ACCESS_TOKEN,
  token_type: 'Bearer',
  refresh_token: GOOGLE_CONST.REFRESH_TOKEN,
};

oAuth2Client.setCredentials(credentials);

// let RUN_TIME = '*/10 * * * * *';
// ? Run at every 1 minutes
let RUN_TIME = '* * * * *';

scheduleJob(RUN_TIME, async (fireDate) => {
  logger.log(
    level.info,
    `>> chef_user_live_meeting Supposed to run at ${moment(fireDate)
      .tz(APP_CONST.DEFAULT_TIMEZONE)
      .format()} , but actually ran at ${moment()
      .tz(APP_CONST.DEFAULT_TIMEZONE)
      .format()}`
  );

  const todayDate = moment().format('YYYY-MM-DD');
  const currentTime = moment().format('HH:mm');

  try {
    let timeSlotData = await chefTimeSlotModel.get({
      'not_working_dates.booked_dates': {
        $elemMatch: { date: todayDate },
      },
    });

    timeSlotData.map(async (time) => {
      let { chef_id } = time;

      time.not_working_dates.booked_dates.map(async (data) => {
        let { user_id } = data;
        if (data.date === todayDate) {
          let portfolioData = await portfolioModel.get({
            portfolio_id: data.portfolio_id,
            status: 1,
          });

          portfolioData.map(async (port) => {
            port.recipeAndTime.map(async (rcp) => {
              let [chefData] = await chefModel.get({ chef_id });
              let [userData] = await userModel.get({ user_id });

              const UTCDATE = moment()
                .utc(moment(data.date).utc().format('YYYY-MM-DD HH:mm:ssZ'))
                .format();

              const sub = moment(rcp.time, 'HH:mm')
                .subtract(15, 'minutes')
                .format('HH:mm');

              let googleMeetLink = '';

              if (currentTime === sub) {
                googleMeetLink = await calendarEvent(
                  UTCDATE,
                  chefData,
                  userData
                );

                sendLiveMeetingMail(chefData, googleMeetLink);
                sendLiveMeetingMail(userData, googleMeetLink);
                await chefTimeSlotModel.update(
                  {
                    chef_id: chef_id,
                    'not_working_dates.booked_dates': {
                      $elemMatch: {
                        user_id: user_id,
                      },
                    },
                  },
                  {
                    $set: {
                      'not_working_dates.booked_dates.$.google_meet_link':
                        googleMeetLink,
                    },
                  }
                );
              } else if (rcp.time === currentTime) {

                const roomData = await roomModel.get({
                  $and: [
                    { chef_id: chefData.chef_id },
                    { user_id: userData.user_id },
                  ],
                });

                if (roomData && roomData.length > 0) {
                  let joinChefRoom =
                    APP_CONST.CHEF_UI_URL +
                    `/chat?name=${encodeData(
                      chefData.firstname + ' ' + chefData.lastname
                    )}&room=${encodeData(
                      roomData[0].room_id
                    )}&role=${encodeData('chef')}`;
                  let joinUserRoom =
                    APP_CONST.CHEF_UI_URL +
                    `/chat?name=${encodeData(
                      userData.firstname + ' ' + userData.lastname
                    )}&room=${encodeData(
                      roomData[0].room_id
                    )}&role=${encodeData('user')}`;

                  sendJoinLiveMeetingNowMail(
                    chefData,
                    data.google_meet_link,
                    joinChefRoom
                  );
                  sendJoinLiveMeetingNowMail(
                    userData,
                    data.google_meet_link,
                    joinUserRoom
                  );
                } else {
                  const addedRoom = await roomModel.add({
                    chef_id: chefData.chef_id,
                    user_id: userData.user_id,
                  });
                  let joinChefRoom =
                    APP_CONST.CHEF_UI_URL +
                    `/chat?name=${encodeData(
                      chefData.firstname + ' ' + chefData.lastname
                    )}&room=${encodeData(addedRoom.room_id)}&role=${encodeData(
                      'chef'
                    )}`;
                  let joinUserRoom =
                    APP_CONST.CHEF_UI_URL +
                    `/chat?name=${encodeData(
                      userData.firstname + ' ' + userData.lastname
                    )}&room=${encodeData(addedRoom.room_id)}&role=${encodeData(
                      'user'
                    )}`;

                  sendJoinLiveMeetingNowMail(
                    chefData,
                    data.google_meet_link,
                    joinChefRoom
                  );
                  sendJoinLiveMeetingNowMail(
                    userData,
                    data.google_meet_link,
                    joinUserRoom
                  );
                }

                await chefTimeSlotModel.update(
                  {
                    chef_id: chef_id,
                    'not_working_dates.booked_dates': {
                      $elemMatch: {
                        user_id: user_id,
                      },
                    },
                  },
                  {
                    $set: {
                      'not_working_dates.booked_dates.$.status': 9,
                    },
                  }
                );
              }
            });
          });
        }
      });
    });
  } catch (error) {
    logger.log(level.error, `>> chef_user_live_meeting  JOB error ${error}`);
  }

  logger.log(
    level.info,
    `>> chef_user_live_meeting JOB executed successfully at ${moment()
      .tz(APP_CONST.DEFAULT_TIMEZONE)
      .format()}`
  );
});

export const sendLiveMeetingMail = async (userData, meetingLink) => {
  let { email, firstname } = userData;

  const message = {
    to: email,
    from: SENDGRID_CONST.SENDGRID_FROM,
    templateId: SENDGRID_CONST.LINE_MEETING_TEMPLATE_ID,
    dynamic_template_data: {
      LOGO: APP_CONST.LOGO_URL,
      NAME: firstname,
      MEETING_LINK: meetingLink,
    },
  };

  sendGrid(message);
};

export const sendJoinLiveMeetingNowMail = async (
  userData,
  meetingLink,
  chatLink
) => {
  let { email, firstname } = userData;

  const message = {
    to: email,
    from: SENDGRID_CONST.SENDGRID_FROM,
    templateId: SENDGRID_CONST.JOIN_NOW_TEMPLATE_ID,
    dynamic_template_data: {
      LOGO: APP_CONST.LOGO_URL,
      NAME: firstname,
      MEETING_LINK: meetingLink,
      CHAT_LINK: chatLink,
    },
  };

  sendGrid(message);
};

export const calendarEvent = async (UTCDATE, chefData, userData) => {
  logger.log(level.info, `>> calendarEvent()`);

  return new Promise((resolve, reject) => {
    let calendar = google.calendar({ version: 'v3', oAuth2Client });
    calendar.events.insert(
      {
        auth: oAuth2Client,
        calendarId: 'primary',
        conferenceDataVersion: 1,
        resource: {
          description: 'Meeting with users',
          start: {
            dateTime: UTCDATE,
            timeZone: 'utc',
          },
          end: {
            dateTime: UTCDATE,
            timeZone: 'utc',
          },
          attendees: [{ email: chefData.email }, { email: userData.email }],
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: 10 },
              { method: 'popup', minutes: 10 },
            ],
          },
          conferenceData: {
            createRequest: {
              conferenceSolutionKey: {
                type: 'hangoutsMeet',
              },
              requestId: 'some-random-string',
            },
          },
          summary: 'Meeting with users',
        },
      },
      (err, res) => {
        if (err) {
          logger.log(level.error, `<< calendarEvent error= ${err}`);
          reject(err);
        } else {
          resolve(res.data.hangoutLink);
        }
      }
    );
  });
};
