import jwt from 'jsonwebtoken';

// 1. Define JWT payload interface
export interface JWTPayload {
  accountId: number;
  role: string; // This will store the employee's job_role or 'customer'
}

// 2. Implement generateToken function
export const generateToken = (payload: JWTPayload): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

// 3. Implement verifyToken function
export const verifyToken = (token: string): JWTPayload | null => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  try {
    const decoded = jwt.verify(token, secret) as JWTPayload;
    return decoded;
  } catch (error) {
    return null; // Token is invalid or expired
  }
};