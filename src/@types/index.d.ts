import type { Request } from 'express';
import { Op } from 'sequelize';

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



// types/product.d.ts
export interface ProductSearchFilters {
  productName?: string;
  categoryId?: number;
  minPrice?: { [Op.gte]: number };
  maxPrice?: { [Op.lte]: number };
  productCondition?: string;
  modelYear?: string;
  productStatus?: 'active' | 'closed';
  [Op.or]?: Array<{ name: { [Op.iLike]: string } } | { description: { [Op.iLike]: string } }>;
}
