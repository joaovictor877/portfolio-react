
  # Portfólio de João Victor

  Site de portfólio com páginas estáticas (`index.html`, `login.html`, `admin.html`) e frontend em React (Vite). Deploy no Vercel.

  ## Desenvolvimento

  1. Instale as dependências:
    ```bash
    npm i
    ```
  2. Rode o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

  ### API no desenvolvimento
  - As rotas `/api` são proxy para o domínio publicado por padrão, evitando erro do `@vercel/blob` no Vite.
  - Para customizar, crie `.env.local` e defina:
    ```bash
    VITE_API_BASE_URL=https://joaovictor.app.br
    VITE_API_PROXY_TARGET=https://joaovictor.app.br
    ```

  ## Build e Deploy

  1. Gerar build:
    ```bash
    npm run build
    ```
    O `postbuild` copia `login.html`, `admin.html` e a pasta `images` para `build/`.
  2. Vercel usa [vercel.json](vercel.json) com rewrites:
    - `/login` → `login.html`
    - `/admin` → `admin.html`

  ## Rotas importantes
  - `/` página principal (React)
  - `/login` página de login (Firebase Auth)
  - `/admin` painel para gerenciar projetos

  ## Problemas comuns
  - Erro `Failed to resolve import "@vercel/blob"` no dev: use o proxy de `/api` (já configurado) ou defina `VITE_API_PROXY_TARGET`.
  - 404 em `/login` ou `/admin` em produção: verifique os rewrites no [vercel.json](vercel.json) e se os arquivos existem em `build/` após o `postbuild`.

  ## Migração para MySQL (substitui Vercel Blob)

  O projeto foi migrado para usar MySQL em vez de Vercel Blob para armazenamento de projetos e uploads.

  ### Mudanças realizadas
  - `api/db.js`: Conexão MySQL com pool usando `mysql2/promise`.
  - `api/projects.js`: CRUD de projetos agora usa tabela `projects` no MySQL.
  - `api/upload.js`: Uploads armazenam binários na tabela `uploads` e servem via `/api/file?id=...`.
  - `api/file.js`: Novo endpoint para servir arquivos do banco.
  - `api/schema.sql`: SQL para criar tabelas `projects` e `uploads`.

  ### Configuração
  1. Instale a dependência:
     ```bash
     npm install mysql2
     ```
  2. Configure um banco MySQL (local ou remoto, ex.: PlanetScale, AWS RDS).
  3. Execute o SQL de `api/schema.sql` no banco para criar as tabelas.
  4. Defina variáveis de ambiente (local: `.env.local`; produção: Vercel dashboard):
     - `MYSQL_HOST` (ex.: `127.0.0.1` ou URL remota)
     - `MYSQL_USER` (ex.: `root`)
     - `MYSQL_PASSWORD`
     - `MYSQL_DATABASE` (ex.: `portfolio`)
     - Opcional: `LOG_API=1` para logs detalhados.

  ### Teste local
  - Rode `npm run dev`.
  - Teste APIs: `curl http://localhost:3000/api/projects` (GET) ou POST para criar.

  ### Deploy no Vercel
  - Faça push no GitHub; Vercel implanta automaticamente.
  - No dashboard do Vercel, adicione as variáveis de ambiente acima em "Environment Variables".
  - Certifique-se de que o banco MySQL é acessível da nuvem (ex.: IP público ou VPN).

  ### Notas
  - Arquivos grandes: MySQL BLOB funciona, mas para produção considere S3 ou similar.
  - Migração de dados: Exporte projetos do Vercel Blob e importe no MySQL manualmente se necessário.
  