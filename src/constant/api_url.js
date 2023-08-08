export const constants = {
  ADMIN_PASSWORD_RESET_SUCCESS: `${process.env.ADMIN_URL}/password_reset_success`,
  ADMIN_PASSWORD_RESET_FAILED: `${process.env.ADMIN_URL}/password_reset_failed`,
  ADMIN_EMAIL_VERIFICATION: `${process.env.ADMIN_URL}/auth/email/verified`,
  ADMIN_EMAIL_VERIFICATION_FAILED: `${process.env.ADMIN_URL}/auth/email/failed`,
  USER_PASSWORD_RESET_SUCCESS: `${process.env.USER_UI_URL}/password_reset_success`,
  USER_PASSWORD_RESET_FAILED: `${process.env.USER_UI_URL}/password_reset_failed`,
  USER_EMAIL_VERIFICATION: `${process.env.USER_UI_URL}/auth/email/mb_verification`,
  USER_EMAIL_VERIFICATION_FAILED: `${process.env.USER_UI_URL}/auth/email/mb_failed`,
};
