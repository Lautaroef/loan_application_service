import { Request, Response, NextFunction } from 'express';

const adminRoleCheck = (req: Request, res: Response, next: NextFunction) => {
  const userRole = req.user.role;

  if (userRole === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};

export default adminRoleCheck;
