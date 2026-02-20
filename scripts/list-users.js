// Script para listar usuários do banco de dados
import pool from '../api/db.js';

async function listUsers() {
  try {
    console.log('\n=== Usuários Cadastrados ===\n');
    
    const [users] = await pool.query(
      'SELECT id, username, email, created_at, last_login, is_active FROM users ORDER BY id'
    );
    
    if (users.length === 0) {
      console.log('Nenhum usuário cadastrado.');
    } else {
      users.forEach(user => {
        console.log(`ID: ${user.id}`);
        console.log(`Username: ${user.username}`);
        console.log(`Email: ${user.email || 'N/A'}`);
        console.log(`Criado em: ${user.created_at}`);
        console.log(`Último login: ${user.last_login || 'Nunca'}`);
        console.log(`Ativo: ${user.is_active ? 'Sim' : 'Não'}`);
        console.log('---');
      });
      console.log(`\nTotal: ${users.length} usuário(s)\n`);
    }
    
  } catch (error) {
    console.error('❌ Erro ao listar usuários:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

listUsers();
