# Deploy no Railway - Guia Completo

## 🚀 Como fazer Deploy no Railway

### 1️⃣ Preparar o Projeto

Certifique-se de que tem o build pronto:
```bash
npm run build
```

### 2️⃣ Configurar Variáveis de Ambiente no Railway

No painel do Railway, vá em **Variables** e adicione:

```
MYSQL_HOST=switchyard.proxy.rlwy.net:26744
MYSQL_USER=root
MYSQL_PASSWORD=nmKUGqJDAOwTHKOuzMspBlZlHKOEMKPS
MYSQL_DATABASE=portfolio
NODE_ENV=production
LOG_API=1
```

⚠️ **IMPORTANTE:** O Railway define `PORT` automaticamente, não configure manualmente!

### 3️⃣ Deploy

O Railway vai:
1. Detectar que é um projeto Node.js
2. Executar `npm install`
3. Executar `npm run build`
4. Iniciar com `node start-server.js`

### 4️⃣ Inicializar o Banco

Após o primeiro deploy, você precisa criar as tabelas. Execute localmente:

```bash
# Configure o .env com suas credenciais do Railway
npm run db:init
```

Ou execute direto no Railway via terminal deles:
```bash
node scripts/init-db.js
```

### 5️⃣ Criar Usuário Admin

Execute localmente ou no Railway:
```bash
npm run user:create
```

Ou use o SQL direto (veja create-user-example.sql)

## 📋 URLs do Projeto

Após o deploy, seu portfólio estará em:
- **Home:** `https://seu-projeto.up.railway.app/`
- **Login:** `https://seu-projeto.up.railway.app/login`
- **Admin:** `https://seu-projeto.up.railway.app/admin`

## ✅ Checklist de Deploy

- [x] Build gerado (`npm run build`)
- [x] Variáveis de ambiente configuradas no Railway
- [x] `railway.json` configurado
- [x] Tabelas criadas no banco (`npm run db:init`)
- [x] Usuário admin criado (`npm run user:create`)
- [ ] Push para repositório Git
- [ ] Deploy no Railway
- [ ] Testar login em produção

## 🔧 Scripts Úteis

```bash
# Desenvolvimento local
npm run dev:full          # Backend + Frontend

# Build para produção
npm run build             # Gera pasta build/

# Banco de dados
npm run db:init           # Criar tabelas
npm run user:create       # Criar usuário
npm run user:list         # Listar usuários
npm run user:delete       # Deletar usuário
npm run password:hash     # Gerar hash de senha

# Servidor de produção
node start-server.js      # Inicia servidor
```

## 🐛 Troubleshooting

### Erro: "Table 'users' doesn't exist"
Execute: `npm run db:init`

### Erro: "Cannot connect to database"
Verifique as variáveis de ambiente no Railway

### Login não funciona
1. Verifique se as tabelas foram criadas
2. Liste os usuários: `npm run user:list`
3. Crie um novo usuário se necessário

## 📞 Suporte

Se precisar de ajuda, verifique:
1. Logs do Railway
2. Variáveis de ambiente configuradas
3. Banco de dados acessível
