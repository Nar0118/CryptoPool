import { Router } from 'express';
import {
  requireAuth,
  requireAuthAdmin,
} from '../../middleware/auth.middleware';
import { getAllInvoices, sendInvoice } from './Invoice.api.handlers';

const router = Router();

router.post('/', requireAuth, sendInvoice);
router.get('/', requireAuthAdmin, getAllInvoices);

export default router;
