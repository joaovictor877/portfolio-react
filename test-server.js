import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authHandler from './api/auth.js';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Teste básico
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Rota de autenticação
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

app.listen(PORT, () => {
  console.log(`🚀 Test API Server running on http://localhost:${PORT}`);
  console.log(`📊 Database: ${process.env.MYSQL_DATABASE || 'portfolio'}`);
});
