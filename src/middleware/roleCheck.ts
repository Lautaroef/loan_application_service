// In src/middleware/roleCheck.ts
import { Request, Response, NextFunction } from 'express';

const adminRoleCheck = (req: Request, res: Response, next: NextFunction) => {
  const userRole = req.headers['role']; // In a real situation, this would come from the "user.context"
  if (userRole === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};

export default adminRoleCheck;
