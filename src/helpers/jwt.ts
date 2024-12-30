import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from '../config';

const JWT_SECRET = config.JWT_SECRET || ""; 

export const generateJWT = (user: any): string => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name }, 
    JWT_SECRET, 
    { expiresIn: '1w' } 
  );
};


export const verifyJWT = (token: string): JwtPayload | string => {
  return jwt.verify(token, JWT_SECRET);
};
