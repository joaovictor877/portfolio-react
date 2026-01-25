import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || '192.168.15.28',
  user: process.env.MYSQL_USER || 'portfolio',
  password: process.env.MYSQL_PASSWORD || '04B43ab2a',
  database: process.env.MYSQL_DATABASE || 'portfolio',
  waitForConnections: true,
  connectionLimit: 10,
  timezone: '+00:00'
});

export default pool;
