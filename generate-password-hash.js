// Script simples para gerar hash de senha
import bcrypt from 'bcryptjs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function generateHash() {
  try {
    const password = await question('Digite a senha para gerar o hash: ');
    
    if (!password) {
      console.error('❌ Senha não pode ser vazia!');
      process.exit(1);
    }
    
    console.log('\n⏳ Gerando hash...\n');
    
    const hash = await bcrypt.hash(password, 10);
    
    console.log('✅ Hash gerado com sucesso!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Senha:', password);
    console.log('Hash:', hash);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('📋 Use este SQL para inserir o usuário:\n');
    console.log(`INSERT INTO users (username, email, password_hash, is_active)`);
    console.log(`VALUES ('seu_username', 'seu_email@exemplo.com', '${hash}', TRUE);\n`);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

generateHash();
