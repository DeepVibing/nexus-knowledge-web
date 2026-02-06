import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import type { User, TokenResponse, UserInfo } from '../types';
import { LOCAL_STORAGE_KEYS } from '../config/constants';
import { authService } from '../services/auth';

const STORAGE_KEY_USER = 'kb_auth_user';
const TOKEN_REFRESH_MARGIN_MS = 5 * 60 * 1000; // Refresh 5 minutes before expiry
const STORAGE_KEY_TOKEN_EXPIRY = 'kb_token_expiry';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  getToken: () => string | null;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapUserInfoToUser(userInfo: UserInfo): User {
  return {
    id: userInfo.id,
    email: userInfo.email,
    name: userInfo.fullName,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userInfo.email}`,
    role: userInfo.role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Store token expiry time
  const storeTokenExpiry = useCallback((expiresIn: number) => {
    const expiryTime = Date.now() + expiresIn * 1000;
    localStorage.setItem(STORAGE_KEY_TOKEN_EXPIRY, expiryTime.toString());
  }, []);

  // Get token expiry time
  const getTokenExpiry = useCallback((): number | null => {
    const expiry = localStorage.getItem(STORAGE_KEY_TOKEN_EXPIRY);
    return expiry ? parseInt(expiry, 10) : null;
  }, []);

  // Clear refresh timer
  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  // Schedule token refresh
  const scheduleTokenRefresh = useCallback((expiresIn: number) => {
    clearRefreshTimer();

    // Refresh token before expiry
    const refreshTime = expiresIn * 1000 - TOKEN_REFRESH_MARGIN_MS;
    if (refreshTime > 0) {
      refreshTimerRef.current = setTimeout(async () => {
        try {
          const refreshToken = authService.getRefreshToken();
          if (refreshToken) {
            const tokenResponse = await authService.refresh(refreshToken);
            authService.storeTokens(tokenResponse);
            storeTokenExpiry(tokenResponse.expiresIn);
            scheduleTokenRefresh(tokenResponse.expiresIn);
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
          // Don't logout on refresh failure - let the user continue until token actually expires
        }
      }, refreshTime);
    }
  }, [clearRefreshTimer, storeTokenExpiry]);

  // Refresh session manually
  const refreshSession = useCallback(async () => {
    const refreshToken = authService.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const tokenResponse = await authService.refresh(refreshToken);
    authService.storeTokens(tokenResponse);
    storeTokenExpiry(tokenResponse.expiresIn);

    const appUser = mapUserInfoToUser(tokenResponse.user);
    setUser(appUser);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(appUser));

    scheduleTokenRefresh(tokenResponse.expiresIn);
  }, [storeTokenExpiry, scheduleTokenRefresh]);

  // Check for existing session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
      const storedUser = localStorage.getItem(STORAGE_KEY_USER);

      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          // Check if token needs refresh
          const tokenExpiry = getTokenExpiry();
          if (tokenExpiry) {
            const timeUntilExpiry = tokenExpiry - Date.now();
            if (timeUntilExpiry < TOKEN_REFRESH_MARGIN_MS) {
              // Token is about to expire, refresh now
              try {
                await refreshSession();
              } catch {
                // Refresh failed, try to verify with /me endpoint
                try {
                  const userInfo = await authService.getMe();
                  const appUser = mapUserInfoToUser(userInfo);
                  setUser(appUser);
                  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(appUser));
                } catch {
                  // Session invalid, clear everything
                  authService.clearTokens();
                  localStorage.removeItem(STORAGE_KEY_USER);
                  localStorage.removeItem(STORAGE_KEY_TOKEN_EXPIRY);
                  setUser(null);
                }
              }
            } else {
              // Schedule refresh for later
              scheduleTokenRefresh(timeUntilExpiry / 1000);
            }
          }
        } catch (error) {
          console.error('Failed to parse stored user:', error);
          authService.clearTokens();
          localStorage.removeItem(STORAGE_KEY_USER);
          localStorage.removeItem(STORAGE_KEY_TOKEN_EXPIRY);
        }
      }

      setIsLoading(false);
    };

    initializeAuth();

    return () => {
      clearRefreshTimer();
    };
  }, [getTokenExpiry, refreshSession, scheduleTokenRefresh, clearRefreshTimer]);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const tokenResponse: TokenResponse = await authService.login({ email, password });
      authService.storeTokens(tokenResponse);
      storeTokenExpiry(tokenResponse.expiresIn);

      const appUser = mapUserInfoToUser(tokenResponse.user);
      setUser(appUser);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(appUser));

      // Schedule token refresh
      scheduleTokenRefresh(tokenResponse.expiresIn);
    } catch (error: unknown) {
      console.error('Login failed:', error);
      const err = error as { statusCode?: number; message?: string };
      if (err.statusCode === 401) {
        throw new Error('Invalid email or password');
      } else if (err.message) {
        throw new Error(err.message);
      } else {
        throw new Error('Login failed. Please try again.');
      }
    }
  };

  const register = async (email: string, password: string, fullName: string): Promise<void> => {
    try {
      const tokenResponse: TokenResponse = await authService.register({
        email,
        password,
        fullName,
      });
      authService.storeTokens(tokenResponse);
      storeTokenExpiry(tokenResponse.expiresIn);

      const appUser = mapUserInfoToUser(tokenResponse.user);
      setUser(appUser);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(appUser));

      // Schedule token refresh
      scheduleTokenRefresh(tokenResponse.expiresIn);
    } catch (error: unknown) {
      console.error('Registration failed:', error);
      const err = error as { message?: string };
      if (err.message) {
        throw new Error(err.message);
      } else {
        throw new Error('Registration failed. Please try again.');
      }
    }
  };

  const logout = useCallback(() => {
    clearRefreshTimer();
    setUser(null);
    authService.logout(); // This calls the API and clears tokens
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN_EXPIRY);
  }, [clearRefreshTimer]);

  const getToken = (): string | null => {
    return authService.getAccessToken();
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    getToken,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
