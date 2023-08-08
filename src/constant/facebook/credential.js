export const constants = {
  PROVIDER: process.env.FACEBOOK_PROVIDER,
  FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
  CALLBACK_URL: process.env.FACEBOOK_CALLBACK_URL || "/api/auth/facebook/callback",
  SCOPE: ["email", "public_profile"],
  FAILURE_REDIRECT: "/",
};
