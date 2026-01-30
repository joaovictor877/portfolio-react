import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const [host, port] = (process.env.MYSQL_HOST || '127.0.0.1').split(':');

const config = {
  host: host,
  port: port ? parseInt(port) : 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'portfolio',
};

async function initDatabase() {
  let connection;
  try {
    console.log('🔌 Conectando ao MySQL...');
    console.log(`Host: ${config.host}:${config.port}`);
    
    // Conectar sem especificar o banco
    const tempConfig = { ...config };
    delete tempConfig.database;
    
    connection = await mysql.createConnection(tempConfig);
    console.log('✅ Conectado ao MySQL!');

    // Criar banco de dados se não existir
    console.log(`\n📋 Criando banco de dados '${config.database}'...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\``);
    console.log('✅ Banco de dados criado!');
    
    // Usar o banco
    await connection.query(`USE \`${config.database}\``);
    console.log(`✅ Usando banco: ${config.database}`);

    // Criar tabela de projetos
    console.log('\n📋 Criando tabela projects...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id VARCHAR(100) PRIMARY KEY,
        data JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabela projects criada!');

    // Criar tabela de uploads
    console.log('\n📋 Criando tabela uploads...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS uploads (
        id VARCHAR(150) PRIMARY KEY,
        filename VARCHAR(255),
        mime VARCHAR(100),
        data LONGBLOB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabela uploads criada!');

    // Verificar tabelas existentes
    console.log('\n📊 Tabelas no banco:');
    const [tables] = await connection.execute('SHOW TABLES');
    console.table(tables);

    console.log('\n🎉 Banco de dados inicializado com sucesso!');
    console.log('\n📝 Próximos passos:');
    console.log('1. Execute: npm run dev:full');
    console.log('2. Acesse: http://localhost:3000');
    console.log('3. Login admin em: http://localhost:3000/login');

  } catch (error) {
    console.error('❌ Erro ao inicializar banco:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initDatabase();
