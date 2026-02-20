# Sistema de Autenticação com Banco de Dados

## Mudanças Implementadas

O sistema de login foi atualizado para usar o banco de dados MySQL em vez de credenciais hardcoded.

### O que foi alterado:

1. **Banco de Dados**
   - Adicionada tabela `users` para armazenar usuários
   - Senhas são armazenadas com hash bcrypt (seguro)
   - Campos: id, username, email, password_hash, created_at, last_login, is_active

2. **API de Autenticação** 
   - Agora verifica credenciais no banco de dados
   - Usa bcrypt para comparar senhas de forma segura
   - Registra último login do usuário

3. **Scripts de Gerenciamento**
   - `npm run user:create` - Criar novo usuário
   - `npm run user:list` - Listar todos os usuários
   - `npm run user:delete` - Deletar usuário

## Como Usar

### 1. Instalar Dependências

```bash
npm install
```

Isso instalará o `bcryptjs` necessário para hash de senhas.

### 2. Atualizar o Banco de Dados

Execute o script SQL para criar a tabela de usuários:

```bash
mysql -u seu_usuario -p portfolio < portfolio-setup.sql
```

Ou execute manualmente no MySQL:

```sql
USE portfolio;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  is_active BOOLEAN DEFAULT TRUE
);
```

### 3. Criar Seu Primeiro Usuário

```bash
npm run user:create
```

O script vai pedir:
- Username (nome de usuário para login)
- Email (opcional)
- Senha (mínimo 6 caracteres)
- Confirmação da senha

Exemplo:
```
Username: admin
Email (opcional): admin@exemplo.com
Senha: minhasenha123
Confirme a senha: minhasenha123
```

### 4. Fazer Login

Acesse [http://localhost:5173/login.html](http://localhost:5173/login.html) e use as credenciais que você criou.

## Comandos Úteis

### Listar usuários cadastrados
```bash
npm run user:list
```

### Criar novo usuário
```bash
npm run user:create
```

### Deletar usuário
```bash
npm run user:delete
```

## Segurança

- ✅ Senhas são armazenadas com hash bcrypt (não em texto puro)
- ✅ Validação de senha mínima de 6 caracteres
- ✅ Proteção contra usuários duplicados
- ✅ Usuários inativos não podem fazer login
- ✅ Registro de último acesso

## Estrutura de Arquivos

```
api/
  ├── auth.js          # API de autenticação (atualizada)
  ├── db.js            # Conexão com MySQL
  └── schema.sql       # Schema do banco (atualizado)

scripts/
  ├── create-user.js   # Script para criar usuários (NOVO)
  ├── list-users.js    # Script para listar usuários (NOVO)
  └── delete-user.js   # Script para deletar usuários (NOVO)

login.html             # Página de login (já funcionando)
portfolio-setup.sql    # Setup completo do banco (atualizado)
```

## Troubleshooting

### Erro: "Cannot find package 'bcryptjs'"
Execute: `npm install`

### Erro: "Table 'users' doesn't exist"
Execute o SQL de criação da tabela (passo 2)

### Erro: "Access denied for user"
Verifique as credenciais do banco no arquivo `.env`:
```
MYSQL_HOST=127.0.0.1
MYSQL_USER=seu_usuario
MYSQL_PASSWORD=sua_senha
MYSQL_DATABASE=portfolio
```
