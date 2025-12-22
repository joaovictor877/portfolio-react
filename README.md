
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
  