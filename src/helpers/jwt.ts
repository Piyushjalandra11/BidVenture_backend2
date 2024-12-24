import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = 'My-Auth'; 

// Generate JWT Token
export const generateJWT = (user: any): string => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name }, 
    JWT_SECRET, 
    { expiresIn: '1h' } 
  );
};

// Verify JWT Token
export const verifyJWT = (token: string): JwtPayload | string => {
  return jwt.verify(token, JWT_SECRET);
};
