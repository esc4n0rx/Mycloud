import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { authMiddleware } from './middlewares/authMiddleware';
import fileRoutes from './routes/fileRoutes';

// Carrega variáveis de ambiente do .env
dotenv.config();

const app = express();

// Middleware para parsear JSON no corpo das requisições
app.use(express.json());

// Define o caminho para o diretório de uploads
const uploadsDir = path.resolve(process.env.UPLOADS_DIR || 'uploads');

// Garante que o diretório de uploads exista na inicialização
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`Diretório de uploads criado em: ${uploadsDir}`);
}

// Rota de health check
app.get('/', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Servidor no ar.' });
});

// Aplica o middleware de autenticação a todas as rotas abaixo
app.use(authMiddleware);

// Rotas da aplicação
app.use('/', fileRoutes);

export default app;
