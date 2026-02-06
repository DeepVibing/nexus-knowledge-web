import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { API_CONFIG, LOCAL_STORAGE_KEYS } from '../config/constants';
import type { ApiError } from '../types/common';

class ApiClient {
  public client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add workspace ID if available
        const workspaceId = localStorage.getItem(LOCAL_STORAGE_KEYS.WORKSPACE_ID);
        if (workspaceId) {
          config.headers['X-Workspace-ID'] = workspaceId;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        if (error.response) {
          const responseData = error.response.data as Record<string, unknown>;
          const errorMessage =
            (responseData?.error as string) ||
            (responseData?.message as string) ||
            error.message;
          const apiError: ApiError = {
            message: errorMessage,
            code: responseData?.code as string | undefined,
            details: responseData?.details as ApiError['details'],
            statusCode: error.response.status,
          };

          // Handle 401 Unauthorized
          if (error.response.status === 401) {
            localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
            localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
            window.location.href = '/login';
          }

          return Promise.reject(apiError);
        }

        // Network error
        const networkError: ApiError = {
          message: 'Network error. Please check your connection.',
          statusCode: 0,
        };

        return Promise.reject(networkError);
      }
    );
  }

  async getRaw<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async postRaw<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async putRaw<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patchRaw<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async deleteRaw(url: string, config?: AxiosRequestConfig): Promise<void> {
    await this.client.delete(url, config);
  }

  async deleteWithResponse<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  async postForm<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': undefined, // Let Axios set multipart/form-data with boundary
      },
    });
    return response.data;
  }

  getInstance(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
