import db from './db.js';

const LOG = process.env.LOG_API !== '0';
function log(...args) { if (LOG) console.log('[upload]', ...args); }
function logError(...args) { if (LOG) console.error('[upload][error]', ...args); }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { name, type, data } = req.body || {};
    if (!name || !type || !data) {
      res.status(400).json({ error: 'Missing name, type or data' });
      return;
    }

    const buffer = Buffer.from(data, 'base64');
    const id = String(Date.now()) + '_' + Math.random().toString(36).slice(2,8);

    await db.execute('INSERT INTO uploads (id, filename, mime, data) VALUES (?, ?, ?, ?)', [id, name, type, buffer]);

    const publicUrl = `/api/file?id=${encodeURIComponent(id)}`;
    log('upload OK', { id, size: buffer.length, type });
    res.status(200).json({ id, url: publicUrl });
  } catch (err) {
    logError('Upload error:', err);
    res.status(500).json({ error: 'Upload failed', details: String(err) });
  }
}
