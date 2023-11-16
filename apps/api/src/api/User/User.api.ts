import { Router } from 'express';
import {
  requireAuth,
  requireAuthAdmin,
} from '../../middleware/auth.middleware';
import {
  getAllUsers,
  updateCurrentUser,
  deleteUser,
  signup,
  login,
  changePassword,
  getCurrentUser,
  updateUserById,
  createUser,
  logout,
  signupByGoogle,
  loginByGoogle,
  sendRecoverPasswordEmail,
  checkVerificationCode,
  updateForgottenPassword,
  updateEmbed,
  getWalletBalance,
  getUserInfoByIdentificationToken,
  getPayWallet,
  getUserById,
} from './User.api.handlers';

const router = Router();

router.get('/admin', requireAuthAdmin, getAllUsers);
router.get('/me', requireAuth, getCurrentUser);
router.get('/child-wallet', getPayWallet);
router.get('/wallet-balance', requireAuth, getWalletBalance);
router.get('/:identificationToken', getUserInfoByIdentificationToken);
router.get('/by-id/:id', getUserById);
router.post('/recover-password', sendRecoverPasswordEmail);
router.post('/check-mail', checkVerificationCode);
router.post('/admin', requireAuthAdmin, createUser);
router.post('/logout', requireAuth, logout);
router.put('/', requireAuth, updateCurrentUser);
router.put('/admin/update-user/:id', requireAuthAdmin, updateUserById);
router.put('/update-embed', requireAuth, updateEmbed);
router.delete('/admin/:id', requireAuthAdmin, deleteUser);
router.post('/signup', signup);
router.post('/login', login);
router.post('/signup/google', signupByGoogle);
router.put('/update-forgotten-password', updateForgottenPassword);
router.post('/login/google', loginByGoogle);
router.put('/change-password', requireAuth, changePassword);

export default router;
