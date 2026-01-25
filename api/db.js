import mysql from 'mysql2/promise';

const [host, port] = (process.env.MYSQL_HOST || '127.0.0.1').split(':');

const pool = mysql.createPool({
  host: host,
  port: port ? parseInt(port) : 3306,
  user: process.env.MYSQL_USER || 'portfolio',
  password: process.env.MYSQL_PASSWORD || '04B43ab2a',
  database: process.env.MYSQL_DATABASE || 'portfolio',
  waitForConnections: true,
  connectionLimit: 10,
  timezone: '+00:00'
});

export default pool;
