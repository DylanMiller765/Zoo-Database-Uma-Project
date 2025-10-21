import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const signToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET);
};

export const verifyToken = (token: string): object | string => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};
