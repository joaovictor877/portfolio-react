# Deploy no Vercel - Guia Completo

## 1. Configurar Variáveis de Ambiente

No Vercel Dashboard → Settings → Environment Variables, adicione:

```
MYSQL_HOST=switchyard.proxy.rlwy.net
MYSQL_PORT=26744
MYSQL_USER=root
MYSQL_PASSWORD=nmKUGqJDAOwTHKOuzMspBlZlHKOEMKPS
MYSQL_DATABASE=portfolio
NODE_ENV=production
```

## 2. Build Settings no Vercel

- **Framework Preset**: Vite
- **Build Command**: `vite build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## 3. Estrutura do Projeto

```
├── api/              # Serverless API Functions
│   ├── auth.js       # POST /api/auth
│   ├── projects.js   # GET/POST/PUT/DELETE /api/projects
│   ├── upload.js     # POST /api/upload
│   ├── file.js       # GET /api/file
│   └── db.js         # MySQL connection pool
├── src/              # React App Source
│   ├── pages/        # React Router pages
│   ├── components/   # React components
│   └── routes.ts     # Router configuration
└── dist/             # Build output (auto-generated)
```

## 4. Como Funciona

- **Frontend**: Vite build gera arquivos estáticos em `dist/`
- **API**: Arquivos em `api/` são automaticamente convertidos em serverless functions
- **Rotas**: React Router gerencia rotas no frontend (/, /login, /admin)
- **Database**: Conecta ao MySQL na Railway

## 5. URLs em Produção

- Home: `https://seu-dominio.vercel.app/`
- Login: `https://seu-dominio.vercel.app/login`
- Admin: `https://seu-dominio.vercel.app/admin`
- API Auth: `https://seu-dominio.vercel.app/api/auth`

## 6. Testar Localmente

```bash
# Instalar dependências
npm install

# Rodar frontend e backend
npm run dev:full

# Apenas frontend
npm run dev

# Apenas backend
npm run api
```

## 7. Deploy Manual

```bash
# Commit mudanças
git add .
git commit -m "Sua mensagem"
git push

# Vercel fará deploy automaticamente se conectado ao GitHub
```

## 8. Troubleshooting

### Erro 404 nas rotas
- Verifique se `vercel.json` está correto
- Confirme que `dist/` está sendo gerado no build

### Erro nas APIs
- Verifique as variáveis de ambiente no Vercel
- Teste conexão com banco: acesse `/api/auth` direto

### Erro de CORS
- As APIs já incluem headers CORS corretos
- Certifique-se que NODE_ENV=production está setado
