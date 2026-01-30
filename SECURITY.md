# 🔐 Configuração de Segurança

## Variáveis de Ambiente

Este projeto usa variáveis de ambiente para proteger informações sensíveis.

### Setup

1. **Copie o arquivo de exemplo:**
   ```bash
   cp .env.example .env
   ```

2. **Configure suas credenciais no arquivo `.env`:**
   - Credenciais do banco MySQL (Railway)
   - Usuário e senha do admin

3. **IMPORTANTE:** 
   - ❌ **NUNCA** commite o arquivo `.env` no git
   - ✅ O `.env` já está no `.gitignore`
   - ✅ Sempre use `.env.example` como template

### Se você já commitou o .env por acidente:

```bash
# Remove do git mas mantém local
git rm --cached .env

# Commit a remoção
git commit -m "Remove .env do repositório"

# Remove do histórico (se necessário)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all
```

## Credenciais Padrão

**Login Admin:**
- Usuário: configurado no `.env`
- Senha: configurada no `.env`

**⚠️ ALTERE AS CREDENCIAIS PADRÃO ANTES DE USAR EM PRODUÇÃO!**
