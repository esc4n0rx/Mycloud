import { Router } from 'express';
import { createFolder, uploadFiles, getFile, deleteFile } from '../controllers/fileController';
import { upload } from '../middlewares/multerMiddleware';

const router = Router();

// Rota para criar uma pasta
router.post('/folder', createFolder);

// Rota para fazer upload de arquivos para uma pasta específica (aceita até 10 arquivos por vez)
router.post('/upload/:folder', upload.array('files', 10), uploadFiles);

// Rota para servir/download de um arquivo
router.get('/files/:folder/:filename', getFile);

// Rota para deletar um arquivo
router.delete('/files/:folder/:filename', deleteFile);

export default router;
