import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../utils/jwt.util';
import { pool } from '../config/database';
import { AuthUser, User, Employee } from '../types/user.types';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }

  try {
    const [userRows] = await pool.query('SELECT * FROM user_accounts WHERE account_id = ?', [decoded.accountId]);
    const user = (userRows as User[])[0];

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    let authUser: AuthUser = { ...user };

    if (user.role === 'employee' && user.employee_id) {
      const [employeeRows] = await pool.query('SELECT * FROM employees WHERE employee_id = ?', [user.employee_id]);
      const employee = (employeeRows as Employee[])[0];
      if (employee) {
        authUser.employee = employee;
        // IMPORTANT: Override the general 'employee' role with the specific job_role for permissions
        authUser.role = employee.job_role;
      }
    }
    // TODO: Add customer fetching logic if needed in the future

    req.user = authUser;
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Server error during authentication' });
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }
    next();
  };
};