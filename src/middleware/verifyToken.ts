import type { User } from '../types';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer TOKEN
  console.log('token:', token);

  if (!token) {
    return res.status(403).json({ message: 'A token is required for authentication' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded as User;
  } catch (err) {
    return res.status(401).json({ message: 'Invalid Token' });
  }

  return next();
};

export default verifyToken;
