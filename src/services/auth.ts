/**
 * Auth Service for Nexus Knowledge
 *
 * API Endpoints:
 * - POST /api/v1/kb/auth/register - Register new user
 * - POST /api/v1/kb/auth/login - Login
 * - POST /api/v1/kb/auth/refresh - Refresh token
 * - GET  /api/v1/kb/auth/me - Get current user
 * - POST /api/v1/kb/auth/logout - Logout
 */

import { apiClient } from '../lib/api-client';
import { LOCAL_STORAGE_KEYS } from '../config/constants';
import type { LoginRequest, RegisterRequest, TokenResponse, UserInfo } from '../types';

const AUTH_BASE_URL = '/api/v1/kb/auth';

export const authService = {
  /**
   * Register a new user
   */
  register: async (data: RegisterRequest): Promise<TokenResponse> => {
    return apiClient.postRaw<TokenResponse>(`${AUTH_BASE_URL}/register`, data);
  },

  /**
   * Login with email and password
   */
  login: async (data: LoginRequest): Promise<TokenResponse> => {
    return apiClient.postRaw<TokenResponse>(`${AUTH_BASE_URL}/login`, data);
  },

  /**
   * Refresh access token
   */
  refresh: async (refreshToken: string): Promise<TokenResponse> => {
    return apiClient.postRaw<TokenResponse>(`${AUTH_BASE_URL}/refresh`, { refreshToken });
  },

  /**
   * Get current authenticated user
   */
  getMe: async (): Promise<UserInfo> => {
    return apiClient.getRaw<UserInfo>(`${AUTH_BASE_URL}/me`);
  },

  /**
   * Logout (invalidate refresh token)
   */
  logout: async (): Promise<void> => {
    try {
      const refreshToken = authService.getRefreshToken();
      if (refreshToken) {
        await apiClient.postRaw(`${AUTH_BASE_URL}/logout`, { refreshToken });
      }
    } catch {
      // Ignore logout errors - still clear local tokens
    }
    authService.clearTokens();
  },

  /**
   * Store tokens in localStorage
   */
  storeTokens: (response: TokenResponse): void => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, response.accessToken);
    localStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
  },

  /**
   * Clear tokens from localStorage
   */
  clearTokens: (): void => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
  },

  /**
   * Get access token from localStorage
   */
  getAccessToken: (): string | null => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
  },

  /**
   * Get refresh token from localStorage
   */
  getRefreshToken: (): string | null => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
  },

  /**
   * Check if user has valid token
   */
  isAuthenticated: (): boolean => {
    return !!authService.getAccessToken();
  },
};

export default authService;
