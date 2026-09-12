import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import {
  BASE_URL,
  CONNECTION_TIMEOUT_MS,
  ApiPaths,
  UNAUTHENTICATED_PATHS,
} from './apiConstants';
import {
  ApiException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ServerException,
  NetworkException,
  ApiTimeoutException,
} from './apiExceptions';
import { getTokens, saveTokens, clearAuthStorage } from '../storage/tokenStorage';


const mainClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: CONNECTION_TIMEOUT_MS,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});


const refreshClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: CONNECTION_TIMEOUT_MS,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

function isUnauthenticatedPath(path: string): boolean {
  return UNAUTHENTICATED_PATHS.some(p => path.includes(p));
}

/** Attempts to refresh the access token. Returns true on success. */
async function refreshAccessToken(): Promise<boolean> {
  try {
    const stored = await getTokens();
    if (!stored) return false;

    const response = await refreshClient.post(ApiPaths.refreshToken, {
      refreshToken: stored.refreshToken,
    });

    const body = response.data;
    if (body?.success === true) {
      const data = body.data as Record<string, unknown>;
      const newExpiresIn = typeof data.expiresIn === 'number' ? data.expiresIn : 3600;
      const newToken = {
        accessToken: data.accessToken as string,
        refreshToken: (data.refreshToken as string) ?? stored.refreshToken,
        expiresAt: new Date(Date.now() + newExpiresIn * 1000).toISOString(),
      };
      await saveTokens(newToken);
      return true;
    }

    await clearAuthStorage();
    return false;
  } catch {
    await clearAuthStorage();
    return false;
  }
}

// ── Request interceptor: attach Bearer token ────────────────────────────────
mainClient.interceptors.request.use(async config => {
  const path = config.url ?? '';
  if (!isUnauthenticatedPath(path)) {
    const tokens = await getTokens();
    if (tokens) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
  }

  if (__DEV__) {
    console.log('╔═══════════════════════════════════════');
    console.log(`║ REQUEST: ${config.method?.toUpperCase()} ${path}`);
    if (config.data) console.log('├─ Body:', config.data);
    console.log('╚═══════════════════════════════════════');
  }

  return config;
});

// ── Response interceptor: log + 401 refresh-and-retry ──────────────────────
mainClient.interceptors.response.use(
  response => {
    if (__DEV__) {
      console.log('╔═══════════════════════════════════════');
      console.log(`║ RESPONSE: ${response.status} ${response.config.url}`);
      console.log('╚═══════════════════════════════════════');
    }
    return response;
  },
  async (error: AxiosError) => {
    if (__DEV__) {
      console.log('╔═══════════════════════════════════════');
      console.log(`║ ERROR: ${error.code} - ${error.message}`);
      console.log('╚═══════════════════════════════════════');
    }

    const originalRequest = error.config as AxiosRequestConfig & { _retried?: boolean };
    const path = originalRequest?.url ?? '';
    const isRefreshCall = path.includes(ApiPaths.refreshToken);

    if (error.response?.status === 401 && !isRefreshCall && !originalRequest?._retried) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        const tokens = await getTokens();
        if (tokens && originalRequest) {
          originalRequest._retried = true;
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${tokens.accessToken}`,
          };
          return mainClient(originalRequest);
        }
      }
    }

    return Promise.reject(error);
  },
);

function extractErrorMessage(responseData: unknown): string {
  if (responseData && typeof responseData === 'object') {
    const data = responseData as Record<string, unknown>;
    if (typeof data.message === 'string') return data.message;
    if (typeof data.error === 'string') return data.error;
    if (typeof data.detail === 'string') return data.detail;
  }
  if (typeof responseData === 'string') return responseData;
  return 'An error occurred';
}

function toApiException(error: unknown): ApiException {
  if (!axios.isAxiosError(error)) {
    return new ApiException(`Request failed: ${String(error)}`);
  }

  const message = extractErrorMessage(error.response?.data);
  const statusCode = error.response?.status;

  if (error.code === 'ECONNABORTED') {
    return new ApiTimeoutException(`Connection timeout: ${message}`);
  }

  if (!error.response) {
    return new NetworkException(`Network error: ${error.message}`);
  }

  switch (statusCode) {
    case 400:
      return new BadRequestException(message);
    case 401:
      return new UnauthorizedException(message);
    case 403:
      return new ForbiddenException(message);
    case 404:
      return new NotFoundException(message);
    case 500:
      return new ServerException(message);
    default:
      return new ApiException(`HTTP Error: ${message}`, statusCode ?? null);
  }
}

function handleResponseData(data: unknown): unknown {
  if (data === null || data === undefined) return null;
  if (typeof data === 'object' && Object.keys(data as object).length === 0) return null;
  return data;
}

export const apiClient = {
  async get<T = unknown>(
    endpoint: string,
    options?: { params?: Record<string, unknown>; headers?: Record<string, string> },
  ): Promise<T> {
    try {
      const response = await mainClient.get(endpoint, {
        params: options?.params,
        headers: options?.headers,
      });
      return handleResponseData(response.data) as T;
    } catch (e) {
      throw toApiException(e);
    }
  },

  async post<T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: { headers?: Record<string, string> },
  ): Promise<T> {
    try {
      const response = await mainClient.post(endpoint, body, { headers: options?.headers });
      return handleResponseData(response.data) as T;
    } catch (e) {
      throw toApiException(e);
    }
  },

  async put<T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: { headers?: Record<string, string> },
  ): Promise<T> {
    try {
      const response = await mainClient.put(endpoint, body, { headers: options?.headers });
      return handleResponseData(response.data) as T;
    } catch (e) {
      throw toApiException(e);
    }
  },

  async delete<T = unknown>(
    endpoint: string,
    options?: { headers?: Record<string, string>; data?: unknown },
  ): Promise<T> {
    try {
      const response = await mainClient.delete(endpoint, {
        headers: options?.headers,
        data: options?.data,
      });
      return handleResponseData(response.data) as T;
    } catch (e) {
      throw toApiException(e);
    }
  },

  /** Multipart upload, e.g. avatar upload. `file` is a React Native file object: { uri, name, type }. */
  async uploadFile<T = unknown>(
    endpoint: string,
    fieldName: string,
    file: { uri: string; name: string; type: string },
    additionalFields?: Record<string, string>,
  ): Promise<T> {
    try {
      const formData = new FormData();
      formData.append(fieldName, file as unknown as Blob);
      if (additionalFields) {
        Object.entries(additionalFields).forEach(([key, value]) => formData.append(key, value));
      }
      const response = await mainClient.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return handleResponseData(response.data) as T;
    } catch (e) {
      throw toApiException(e);
    }
  },
};

/** Exposed for the app-level session bootstrap (splash screen equivalent) and for tests. */
export { refreshAccessToken };