import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 1 * 30 * 1000,
  max: 1,
  message: {
    error: {
      message: 'err_82',
    },
  },
});
