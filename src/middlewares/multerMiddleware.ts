import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { sanitizeName } from '../utils/sanitize';

const UPLOADS_DIR = path.resolve(process.env.UPLOADS_DIR || 'uploads');

// Garante que o diretório base de uploads exista
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    const folder = sanitizeName(req.params.folder);
    const folderPath = path.join(UPLOADS_DIR, folder);

    // Verifica se a pasta de destino existe antes de salvar
    fs.access(folderPath, (err) => {
      if (err) {
        // A pasta não existe
        return cb(new Error(`A pasta '${folder}' não existe. Crie-a primeiro.`), '');
      }
      cb(null, folderPath);
    });
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const sanitizedFilename = sanitizeName(file.originalname);
    cb(null, `${Date.now()}-${sanitizedFilename}`);
  },
});

export const upload = multer({ 
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 } // Limite de 100MB por arquivo
});
