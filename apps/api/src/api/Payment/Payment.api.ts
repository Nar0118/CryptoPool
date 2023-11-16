import { Router } from 'express';
import {
  convertUsdToCoin,
  getCurrencyBalance,
  payWithQr,
  transferBackToUsers,
  changePaymentStatus,
  initiatePayment,
  getPaymentStatus,
  defaultCallback,
  getTransactionNotification,
  convertUsdToSelectedCurrency,
  payWithQrWidget,
} from './Payment.api.handlers';
import { rateLimitMiddleware } from '../../middleware/rateLimit.middleware';

const router = Router();

router.get('/convert', getCurrencyBalance);
router.get('/convert-coin', convertUsdToCoin);
router.get('/usd-currency-conversation', convertUsdToSelectedCurrency);
router.get('/pay-with-qr', payWithQr);
router.get('/pay-with-qr-widget', payWithQrWidget);
router.get('/transfer-back-to-users/:childId', transferBackToUsers);
router.put('/payment-status/:key', changePaymentStatus);
router.post('/initiate', rateLimitMiddleware, initiatePayment);
router.get('/status/:paymentId', rateLimitMiddleware, getPaymentStatus);
router.post('/callback', defaultCallback);
router.post('/notification/:key', getTransactionNotification);

export default router;
