// Configuração da API
// Se estiver em produção, use caminho relativo para usar as APIs locais
// Se estiver em dev, pode usar o domínio do portfolio original
const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
export const API_BASE_URL = isProduction ? '' : '';

export const API_ENDPOINTS = {
  projects: `/api/projects`,
  upload: `/api/upload`,
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
