import { Router } from 'express';
import { requireAuthAdmin } from '../../middleware/auth.middleware';
import {
  getAllAdmins,
  createAdmin,
  loginForAdmin,
  signupForAdmin,
  updateAdminById,
  deleteAdmin,
  getCurrentAdmin,
} from './Admin.api.handlers';

const router = Router();

router.get('/', requireAuthAdmin, getAllAdmins);
router.get('/me', requireAuthAdmin, getCurrentAdmin);
router.post('/', requireAuthAdmin, createAdmin);
router.post('/login', loginForAdmin);
router.post('/signup', signupForAdmin);
router.put('/update-admin/:id', requireAuthAdmin, updateAdminById);
router.delete('/:id', requireAuthAdmin, deleteAdmin);

export default router;
