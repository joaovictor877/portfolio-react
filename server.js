import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do .env
dotenv.config();

import authHandler from './api/auth.js';
import projectsHandler from './api/projects.js';
import uploadHandler from './api/upload.js';
import fileHandler from './api/file.js';

const app = express();
const PORT = process.env.API_PORT || 3001;

app.use(cors());
// Aumenta o limite para 50MB (para imagens grandes)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Wrapper para adaptar handlers de Vercel para Express
const adaptHandler = (handler) => async (req, res) => {
  try {
    await handler(req, res);
  } catch (error) {
    console.error('API Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

// Rotas da API
app.post('/api/auth', adaptHandler(authHandler));
app.all('/api/projects', adaptHandler(projectsHandler));
app.all('/api/upload', adaptHandler(uploadHandler));
app.get('/api/file', adaptHandler(fileHandler));

app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`📊 MySQL Database: ${process.env.MYSQL_DATABASE || 'portfolio'}`);
});
