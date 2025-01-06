import type { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export interface IUser {
  id: number;
  email: string;
  name: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

