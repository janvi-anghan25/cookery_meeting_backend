export const constants = {
  PORT: process.env.PORT || 8000,
  HOST_URL: process.env.HOST_URL || 'http://localhost:8000',
  SERVICE_URL: process.env.SERVICE_URL || 'http://localhost:8001',
  ADMIN_UI_URL: process.env.ADMIN_UI_URL || 'http://localhost:4000',
  CHEF_UI_URL: process.env.CHEF_UI_URL || 'http://localhost:8002',
  USER_UI_URL: process.env.END_USER_URL || 'http://localhost:4002',
  ADMIN_URL: process.env.ADMIN_URL || 'http://localhost:4001',
  END_USER_URL: process.env.END_USER_URL || 'http://localhost:4002',

  IS_PROD: process.env.NODE_ENV == 'production' ? true : false,
  SESSION_SECRET: process.env.SESSION_SECRET,
  PUBLIC_PATH: 'src/public',
  LOGO_URL: `${process.env.HOST_URL}/static/images/072591b7-4aec-44d9-8fe7-3329193d8a3c-cookeryMeeting.png`,
  PROMO_CODE_STRING:
    'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  ADMIN_SECRET: process.env.ADMIN_SECRET,
  DEFAULT_TIMEZONE: 'Asia/Kolkata', // 'Australia/Melbourne',
  DATE_FORMAT: 'YYYY-MM-DD',
  STRIPE_CONNECT_PLATFORM_CLIENT_ID:
    process.env.STRIPE_CONNECT_PLATFORM_CLIENT_ID,
  STRIPE_CONNECT_PLATFORM_AUTHORIZE_URI:
    process.env.STRIPE_CONNECT_PLATFORM_AUTHORIZE_URI,
  STRIPE_CONNECT_PLATFORM_AUTHORIZE_TOKEN_URI:
    process.env.STRIPE_CONNECT_PLATFORM_AUTHORIZE_TOKEN_URI,
  ACCOUNT_TYPE: process.env.ACCOUNT_TYPE,
  BUSINESS_TYPE: process.env.BUSINESS_TYPE,
  WEBHOOK_CHARGE_SECRET_KEY: process.env.WEBHOOK_CHARGE_SECRET_KEY,
  PAYMENT_METHODS: process.env.PAYMENT_METHODS.split(', '),
  ALLOWED_COUNTRIES: process.env.ALLOWED_COUNTRIES.split(', '),
  MODE: process.env.MODE,
};
