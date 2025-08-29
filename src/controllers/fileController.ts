import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { sanitizeName } from '../utils/sanitize';

const UPLOADS_DIR = path.resolve(process.env.UPLOADS_DIR || 'uploads');

// POST /folder
export const createFolder = async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'O nome da pasta é obrigatório.' });
  }

  const sanitizedFolder = sanitizeName(name);
  if (!sanitizedFolder) {
    return res.status(400).json({ message: 'Nome de pasta inválido.' });
  }

  try {
    const folderPath = path.join(UPLOADS_DIR, sanitizedFolder);
    await fs.mkdir(folderPath, { recursive: true });
    res.status(201).json({ message: `Pasta '${sanitizedFolder}' criada com sucesso.` });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar a pasta.', error });
  }
};

// POST /upload/:folder
export const uploadFiles = (req: Request, res: Response) => {
  if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
    return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
  }

  const fileNames = (req.files as Express.Multer.File[]).map(f => f.filename);
  res.status(201).json({ message: 'Arquivos enviados com sucesso!', files: fileNames });
};

// GET /files/:folder/:filename
export const getFile = async (req: Request, res: Response) => {
  const { folder, filename } = req.params;
  const sanitizedFolder = sanitizeName(folder);
  const sanitizedFilename = sanitizeName(filename);

  const filePath = path.join(UPLOADS_DIR, sanitizedFolder, sanitizedFilename);

  // Medida de segurança extra para garantir que o caminho não saia do diretório de uploads
  if (!filePath.startsWith(UPLOADS_DIR)) {
    return res.status(400).json({ message: 'Caminho de arquivo inválido.' });
  }

  try {
    await fs.access(filePath);
    res.download(filePath, sanitizedFilename);
  } catch (error) {
    res.status(404).json({ message: 'Arquivo não encontrado.' });
  }
};

// DELETE /files/:folder/:filename
export const deleteFile = async (req: Request, res: Response) => {
  const { folder, filename } = req.params;
  const sanitizedFolder = sanitizeName(folder);
  const sanitizedFilename = sanitizeName(filename);

  const filePath = path.join(UPLOADS_DIR, sanitizedFolder, sanitizedFilename);

  // Medida de segurança extra
  if (!filePath.startsWith(UPLOADS_DIR)) {
    return res.status(400).json({ message: 'Caminho de arquivo inválido.' });
  }

  try {
    await fs.access(filePath);
    await fs.unlink(filePath);
    res.status(200).json({ message: 'Arquivo deletado com sucesso.' });
  } catch (error) {
    res.status(404).json({ message: 'Arquivo não encontrado.' });
  }
};
