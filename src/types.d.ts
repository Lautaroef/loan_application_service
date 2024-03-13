import { Request } from 'express';

type User = {
  userId: number;
  role: string;
};

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      userId: number;
      role: string;
    };
  }
}
