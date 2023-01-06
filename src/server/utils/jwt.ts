import jwt from 'jsonwebtoken';

export const generateJWT = (payload: any) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '24h',
  });
};

export const verifyJWT = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};
