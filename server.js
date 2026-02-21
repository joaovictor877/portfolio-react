import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

import authHandler from './api/auth.js';
import projectsHandler from './api/projects.js';
import uploadHandler from './api/upload.js';
import fileHandler from './api/file.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || process.env.API_PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Teste básico
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Rotas da API
app.post('/api/auth', async (req, res) => {
  try {
    await authHandler(req, res);
  } catch (error) {
    console.error('API Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  }
});

app.all('/api/projects', async (req, res) => {
  try {
    await projectsHandler(req, res);
  } catch (error) {
    console.error('API Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  }
});

app.all('/api/upload', async (req, res) => {
  try {
    await uploadHandler(req, res);
  } catch (error) {
    console.error('API Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  }
});

app.get('/api/file', async (req, res) => {
  try {
    await fileHandler(req, res);
  } catch (error) {
    console.error('API Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  }
});

// Em produção, serve arquivos estáticos do dist
if (isProduction) {
  app.use(express.static(path.join(__dirname, 'dist')));
  
  // SPA fallback - todas as rotas vão para index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Exporta o app para Vercel serverless functions
export default app;

// Se não estiver no Vercel (rodando localmente), inicia o servidor
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🚀 API Server running on http://localhost:${PORT}`);
    console.log(`📊 MySQL Database: ${process.env.MYSQL_DATABASE || 'portfolio'}`);
    console.log(`🌍 Environment: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
    if (isProduction) {
      console.log(`📦 Serving static files from: dist/`);
    }
  });
}
