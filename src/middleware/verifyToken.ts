import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secret = (process.env.JWT_SECRET as string) || 'secret';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(403).json({ message: 'A token is required for authentication' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.body.user = decoded;
  } catch (err) {
    return res.status(401).json({ message: 'Invalid Token' });
  }

  return next();
};

export default verifyToken;
