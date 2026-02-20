// API de autenticação com banco de dados MySQL
import bcrypt from 'bcryptjs';
import pool from './db.js';

const LOG = process.env.LOG_API !== '0';
function log(...args) { if (LOG) console.log('[auth]', ...args); }

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      let body = req.body || {};
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch {}
      }
      
      const { username, password } = body;
      
      if (!username || !password) {
        return res.status(400).json({ 
          success: false, 
          message: 'Usuário e senha são obrigatórios' 
        });
      }
      
      // Buscar usuário no banco de dados
      const [rows] = await pool.query(
        'SELECT * FROM users WHERE username = ? AND is_active = TRUE',
        [username]
      );
      
      if (rows.length === 0) {
        log('Login failed - user not found:', username);
        return res.status(401).json({ 
          success: false, 
          message: 'Credenciais inválidas' 
        });
      }
      
      const user = rows[0];
      
      // Verificar senha com bcrypt
      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      
      if (passwordMatch) {
        // Atualizar último login
        await pool.query(
          'UPDATE users SET last_login = NOW() WHERE id = ?',
          [user.id]
        );
        
        log('Login successful for:', username);
        res.status(200).json({ 
          success: true, 
          message: 'Login realizado com sucesso',
          user: { 
            id: user.id,
            username: user.username,
            email: user.email
          }
        });
      } else {
        log('Login failed - wrong password for:', username);
        res.status(401).json({ 
          success: false, 
          message: 'Credenciais inválidas' 
        });
      }
      return;
    }
    
    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[auth][error]', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
}
