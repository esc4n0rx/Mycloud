import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const API_TOKEN = process.env.API_TOKEN;

if (!API_TOKEN) {
  throw new Error('API_TOKEN não está definido no arquivo .env');
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acesso não autorizado: Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1];

  if (token !== API_TOKEN) {
    return res.status(403).json({ message: 'Acesso proibido: Token inválido.' });
  }

  next();
};
