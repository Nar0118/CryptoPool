import { Router } from 'express';
import { requireAuthAdmin } from '../../middleware/auth.middleware';
import {
  getTransactionByHash,
  registerTransaction,
  getTxBlockchainData,
  getAllTransactions,
} from './Transactions.api.handlers';

const router = Router();

router.post('/', registerTransaction);
router.get('/:hash', requireAuthAdmin, getTransactionByHash);
router.get('/etherscan/:hash', requireAuthAdmin, getTxBlockchainData);
router.get('/', requireAuthAdmin, getAllTransactions);

export default router;
