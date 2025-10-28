import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';

class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      const result = await authService.login(email, password);

      res.json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message || 'Login failed'
      });
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: result
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Registration failed'
      });
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      // The 'protect' middleware attaches the user to the request.
      // We use the account_id from there to ensure users can only fetch their own profile.
      const userId = (req as any).user.account_id;

      const profile = await authService.getProfile(Number(userId));

      res.json({
        success: true,
        data: profile
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'User not found'
      });
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.account_id;
      const role = (req as any).user.role;

      await authService.updateProfile(Number(userId), role, req.body);

      // Return fresh profile after update
      const profile = await authService.getProfile(Number(userId));
      res.json({ success: true, data: profile });
    } catch (error: any) {
      const status = error.statusCode || (error.message === 'Forbidden' ? 403 : 400);
      res.status(status).json({ success: false, message: error.message || 'Update failed' });
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Logout failed'
      });
    }
  }
}

export default new AuthController();