import mysql from 'mysql2/promise';

// Parse host and port from environment variable
let host = process.env.MYSQL_HOST || '127.0.0.1';
let port = process.env.MYSQL_PORT || 3306;

// If host includes port (format: host:port), split it
if (host.includes(':')) {
  [host, port] = host.split(':');
  port = parseInt(port);
} else {
  port = parseInt(port);
}

const pool = mysql.createPool({
  host: host,
  port: port,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'portfolio',
  waitForConnections: true,
  connectionLimit: 10,
  timezone: '+00:00',
  connectTimeout: 60000
});

export default pool;
