// Script para deletar usuário do banco de dados
import pool from '../api/db.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function deleteUser() {
  try {
    console.log('\n=== Deletar Usuário ===\n');
    
    // Listar usuários primeiro
    const [users] = await pool.query(
      'SELECT id, username, email FROM users ORDER BY id'
    );
    
    if (users.length === 0) {
      console.log('Nenhum usuário cadastrado.');
      process.exit(0);
    }
    
    console.log('Usuários disponíveis:');
    users.forEach(user => {
      console.log(`  ${user.id}. ${user.username}${user.email ? ` (${user.email})` : ''}`);
    });
    console.log('');
    
    const userId = await question('Digite o ID do usuário para deletar (ou 0 para cancelar): ');
    
    if (userId === '0') {
      console.log('Operação cancelada.');
      process.exit(0);
    }
    
    const userIdNum = parseInt(userId);
    const userToDelete = users.find(u => u.id === userIdNum);
    
    if (!userToDelete) {
      console.error('❌ Usuário não encontrado!');
      process.exit(1);
    }
    
    const confirm = await question(`Confirma a exclusão do usuário "${userToDelete.username}"? (s/n): `);
    
    if (confirm.toLowerCase() !== 's') {
      console.log('Operação cancelada.');
      process.exit(0);
    }
    
    // Deletar usuário
    await pool.query('DELETE FROM users WHERE id = ?', [userIdNum]);
    
    console.log(`\n✅ Usuário "${userToDelete.username}" deletado com sucesso!\n`);
    
  } catch (error) {
    console.error('❌ Erro ao deletar usuário:', error.message);
    process.exit(1);
  } finally {
    rl.close();
    await pool.end();
  }
}

deleteUser();
