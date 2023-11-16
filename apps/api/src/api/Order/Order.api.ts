import { Router } from 'express';
import {
  requireAuth,
  requireAuthAdmin,
} from '../../middleware/auth.middleware';
import {
  getAllOrders,
  getCurrentUserOrders,
  getOrderById,
  registerOrder,
  updateOrder,
  deleteOrder,
} from './Order.api.handlers';

const router = Router();

router.get('/', requireAuthAdmin, getAllOrders);
router.get('/current-user-orders', requireAuth, getCurrentUserOrders);
router.get('/:id', requireAuthAdmin, getOrderById);
router.post('/', requireAuth, registerOrder);
router.put('/', updateOrder);
router.delete('/:id', requireAuthAdmin, deleteOrder);

export default router;
