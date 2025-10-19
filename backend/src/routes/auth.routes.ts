import { Router } from 'express';
import authController from '../controllers/auth.controller';

const router = Router();

router.post('/login', authController.login);
router.get('/profile', authController.getProfile);
router.post('/logout', authController.logout);

export default router;
