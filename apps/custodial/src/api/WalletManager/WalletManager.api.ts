import { Router } from 'express';
import {
  createWallet,
  deleteWallet,
  getAllWallets,
  getWallet,
  createChildWallet,
  deleteChildWallet,
  getAllChildWallets,
  getTransactionURL,
  transferBackToUsers,
  createChildWalletPbp,
  createWalletPbp,
  getChildWalletPbp,
  getChildWallet,
  getAllTempwallets,
  getTempWallet,
  getTransactionURLWidget,
} from './WalletManager.api.handlers';

const router = Router();

router.get('/', getAllWallets);
router.get('/children', getAllTempwallets);
router.post('/', createWallet);
router.get('/:id', getWallet);
router.delete('/:id', deleteWallet);

router.get('/:id/children/', getAllChildWallets);
router.post('/:id/children/', createChildWallet);
router.get('/:id/children/:childId', getChildWallet);
router.get('/:id/children/:childId/transaction-url', getTransactionURL);
router.get('/children/transaction-url-widget', getTransactionURLWidget);
router.delete('/:id/children/:childId', deleteChildWallet);
router.get('/transfer-back/:childId', transferBackToUsers);
router.get('/get-temp-wallet/:id', getTempWallet);

router.post('/pbp', createWalletPbp);
router.post('/:id/children/pbp', createChildWalletPbp);
router.get('/children/:childId/pbp', getChildWalletPbp);

export default router;
