// Configuração da API
export const API_BASE_URL = 'https://joaovictor.app.br';

export const API_ENDPOINTS = {
  projects: `${API_BASE_URL}/api/projects`,
  upload: `${API_BASE_URL}/api/upload`,
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
