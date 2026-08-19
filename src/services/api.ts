import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

/**
 * API Service — centralized HTTP client powered by Axios.
 *
 * The backend person just needs to update VITE_API_BASE_URL and the
 * real endpoints; everything here is already wired into the forms.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api';

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(status: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

function getToken(): string | null {
  try {
    return localStorage.getItem('token') ?? sessionStorage.getItem('token') ?? null;
  } catch {
    return null;
  }
}

// ─── Axios Instance ──────────────────────────────────────────────────

const apiClient = axios.create({
  baseURL: BASE_URL,
});

// ─── Request Interceptor — attach auth token ─────────────────────────

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response Interceptor — normalize errors, handle 401 ────────────

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse>) => {
    const status = error.response?.status ?? 0;
    const body = error.response?.data;

    if (status === 401 && !error.config?.url?.includes('/auth/login')) {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      toast.error('Session expired', {
        description: 'Your session has expired. Please log in again.',
      });
      window.location.href = '/login';
    }

    throw new ApiError(
      status,
      body?.message ?? error.message ?? 'Something went wrong',
      body?.errors,
    );
  },
);

// ─── Generic request helper ──────────────────────────────────────────

async function request<T>(
  endpoint: string,
  options: { method?: string; data?: unknown; params?: Record<string, unknown> } = {},
): Promise<ApiResponse<T>> {
  const isFormData = options.data instanceof FormData;
  const response = await apiClient.request<ApiResponse<T>>({
    url: endpoint,
    method: options.method ?? 'GET',
    data: options.data,
    params: options.params,
    // Only force JSON for non-FormData payloads. For FormData (file uploads)
    // we must NOT set Content-Type, so the browser adds the multipart boundary.
    headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
  });
  return response.data;
}

// ─── Generic ─────────────────────────────────────────────────────────

/** Convenience export for other API calls the backend will provide. */
export { request, ApiError, apiClient };
export type { ApiResponse };
