// Configuração da API
// Produção: usa a mesma origem (''), servida pelo Vercel.
// Desenvolvimento: se não houver VITE_API_BASE_URL, aponta para o domínio já publicado para evitar o Vite servir /api como arquivo.
const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
const fallbackDevBase = 'https://joaovictor.app.br';
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || (isProduction ? '' : fallbackDevBase)).replace(/\/$/, '');

const withBase = (path: string) => `${API_BASE_URL}${path}`;

export const API_ENDPOINTS = {
  projects: withBase('/api/projects'),
  upload: withBase('/api/upload'),
} as const;

// Helper para fazer requests com timeout
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = 10000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}
