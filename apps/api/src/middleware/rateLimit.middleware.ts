import { rateLimit } from 'express-rate-limit';

export const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max requests count
  message: 'You have exceeded your 100 requests per 15 minutes limit.',
  headers: true,
});
