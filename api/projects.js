import db from './db.js';

const LOG = process.env.LOG_API !== '0';
function log(...args) { if (LOG) console.log('[projects]', ...args); }
function logError(...args) { if (LOG) console.error('[projects][error]', ...args); }

async function listProjects() {
  const [rows] = await db.query('SELECT id, data FROM projects ORDER BY created_at DESC');
  return (rows || []).map(r => {
    try { 
      // Se o MySQL já retornou como objeto, usa diretamente
      // Se retornou como string, faz parse
      const parsed = typeof r.data === 'string' ? JSON.parse(r.data) : r.data;
      return parsed;
    } catch (err) { 
      logError('Erro ao parsear projeto:', r.id, err.message);
      return { id: r.id, title: 'Erro ao carregar', description: 'Erro no formato', category: 'error' }; 
    }
  });
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const start = Date.now();
      const projects = await listProjects();
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('CDN-Cache-Control', 'no-store');
      res.setHeader('Vercel-CDN-Cache-Control', 'no-store');
      log('GET /api/projects', { count: projects.length, ms: Date.now() - start });
      res.status(200).json({ projects });
      return;
    }

    if (req.method === 'POST') {
      let body = req.body || {};
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch {}
      }
      const { action, project } = body;

      if (action === 'create') {
        const id = String(Date.now());
        const newProject = { id, ...project };
        await db.execute('INSERT INTO projects (id, data) VALUES (?, ?)', [id, JSON.stringify(newProject)]);
        const projects = await listProjects();
        log('POST create', { id, count: projects.length });
        res.status(200).json({ ok: true, id, projects });
        return;
      }

      if (action === 'update') {
        const { id } = project || {};
        if (!id) return res.status(400).json({ error: 'Missing id' });
        const updated = { ...(project || {}) };
        await db.execute('UPDATE projects SET data = ? WHERE id = ?', [JSON.stringify(updated), id]);
        const projects = await listProjects();
        log('POST update', { id, count: projects.length });
        res.status(200).json({ ok: true, projects });
        return;
      }

      if (action === 'delete') {
        const { id } = body;
        if (!id) return res.status(400).json({ error: 'Missing id' });
        await db.execute('DELETE FROM projects WHERE id = ?', [id]);
        const projects = await listProjects();
        log('POST delete', { id, count: projects.length });
        res.status(200).json({ ok: true, projects });
        return;
      }

      res.status(400).json({ error: 'Invalid action' });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    logError('projects API error:', err);
    res.status(500).json({ error: 'Server error', details: String(err) });
  }
}
