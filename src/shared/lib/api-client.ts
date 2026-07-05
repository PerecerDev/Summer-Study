import type { ApiErrorBody } from '@/shared/types/api/auth';

const API_BASE: string = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';

export class ApiClientError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

function isApiErrorBody(data: unknown): data is ApiErrorBody {
  return (
    typeof data === 'object' &&
    data !== null &&
    'error' in data &&
    typeof (data as ApiErrorBody).error.message === 'string'
  );
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const error = isApiErrorBody(data) ? data : null;
    throw new ApiClientError(
      error?.error.code ?? 'UNKNOWN_ERROR',
      error?.error.message ?? 'Ha ocurrido un error',
      response.status,
      error?.error.details,
    );
  }

  return data as T;
}
