import { Router } from 'express';
import { getAllChildrenWallets, getAllWallets } from './Wallet.api.handlers';

const router = Router();

router.get('/', getAllWallets);
router.get('/children', getAllChildrenWallets);

export default router;
