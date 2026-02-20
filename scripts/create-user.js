// Script para criar usuários no banco de dados
import bcrypt from 'bcryptjs';
import pool from '../api/db.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createUser() {
  try {
    console.log('\n=== Criar Novo Usuário ===\n');
    
    const username = await question('Username: ');
    const email = await question('Email (opcional): ');
    const password = await question('Senha: ');
    const confirmPassword = await question('Confirme a senha: ');
    
    // Validações
    if (!username || !password) {
      console.error('❌ Username e senha são obrigatórios!');
      process.exit(1);
    }
    
    if (password !== confirmPassword) {
      console.error('❌ As senhas não coincidem!');
      process.exit(1);
    }
    
    if (password.length < 6) {
      console.error('❌ A senha deve ter pelo menos 6 caracteres!');
      process.exit(1);
    }
    
    // Verificar se usuário já existe
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );
    
    if (existingUsers.length > 0) {
      console.error(`❌ Usuário "${username}" já existe!`);
      process.exit(1);
    }
    
    // Fazer hash da senha
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Inserir usuário no banco
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email || null, passwordHash]
    );
    
    console.log('\n✅ Usuário criado com sucesso!');
    console.log(`ID: ${result.insertId}`);
    console.log(`Username: ${username}`);
    if (email) console.log(`Email: ${email}`);
    console.log('\n');
    
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error.message);
    process.exit(1);
  } finally {
    rl.close();
    await pool.end();
  }
}

createUser();
