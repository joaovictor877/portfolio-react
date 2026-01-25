import db from './db.js';

const LOG = process.env.LOG_API !== '0';
function log(...args) { if (LOG) console.log('[file]', ...args); }
function logError(...args) { if (LOG) console.error('[file][error]', ...args); }

export default async function handler(req, res) {
  try {
    const id = (req.query && req.query.id) || (req.url && new URL(req.url, 'http://localhost').searchParams.get('id'));
    if (!id) return res.status(400).send('Missing id');

    const [rows] = await db.query('SELECT filename, mime, data FROM uploads WHERE id = ? LIMIT 1', [id]);
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const row = rows[0];
    res.setHeader('Content-Type', row.mime || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${row.filename || id}"`);
    // `data` is a Buffer stored in BLOB column
    res.status(200).send(row.data);
    log('served file', id, row.filename);
  } catch (err) {
    logError('file handler error:', err);
    res.status(500).json({ error: 'Server error', details: String(err) });
  }
}
