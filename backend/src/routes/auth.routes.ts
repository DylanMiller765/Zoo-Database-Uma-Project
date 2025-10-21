import { Router } from 'express';
import { body } from 'express-validator';
import authController from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';

const router = Router();

router.post(
  '/register',
  [
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ],
  validate,
  authController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  authController.login
);

router.get('/profile', authController.getProfile);
router.post('/logout', authController.logout);

export default router;
