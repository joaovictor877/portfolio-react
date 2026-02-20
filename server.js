import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Carrega as variáveis de ambiente do .env
dotenv.config();

import authHandler from './api/auth.js';
import projectsHandler from './api/projects.js';
import uploadHandler from './api/upload.js';
import fileHandler from './api/file.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Railway define PORT automaticamente, senão usa API_PORT ou 3001
const PORT = process.env.PORT || process.env.API_PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

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

// Em produção, serve arquivos estáticos do build
if (isProduction) {
  app.use(express.static(path.join(__dirname, 'build')));
  
  // Rotas HTML sem extensão
  app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'login.html'));
  });
  
  app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'admin.html'));
  });
  
  // Fallback para SPA
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API Server running on port ${PORT}`);
  console.log(`📊 MySQL Database: ${process.env.MYSQL_DATABASE || 'portfolio'}`);
  console.log(`🌍 Environment: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
  if (isProduction) {
    console.log(`📦 Serving static files from: build/`);
  }
});
