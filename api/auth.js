// API de autenticação simples
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

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
      
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        log('Login successful for:', username);
        res.status(200).json({ 
          success: true, 
          message: 'Login realizado com sucesso',
          user: { username }
        });
      } else {
        log('Login failed for:', username);
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
