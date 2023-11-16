import { Router } from 'express';

import {
  getPaymentUser,
  updateUserData,
  authUserPayment,
  getUserTempWallet,
  disabledActiveUser,
  getAllUsersPayments,
} from './UserPayment.api.handlers';

const router = Router();

router.post('/auth', authUserPayment);
router.get('/all', getAllUsersPayments);
router.get('/temp-wallet/:id', getUserTempWallet);
router.get('/get-payment-user', getPaymentUser);
router.put('/update-user-data', updateUserData);
router.put('/disable-active-user', disabledActiveUser);

export default router;
