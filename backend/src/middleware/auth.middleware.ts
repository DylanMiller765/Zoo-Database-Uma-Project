import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';
import { query } from '../config/database';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    const decoded = verifyToken(token) as { id: number, role: string };
    const [user] = await query<any[]>('SELECT * FROM user_accounts WHERE account_id = ?', [decoded.id]);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    (req as any).user = user[0];
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes((req as any).user.job_role)) {
      return res.status(403).json({ success: false, message: 'You do not have permission to perform this action' });
    }
    next();
  };
};
