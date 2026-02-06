export const APP_NAME = 'Nexus Knowledge';
export const APP_DESCRIPTION = 'AI-powered knowledge management and RAG-based chat';

// Environment configuration
export type AppEnvironment = 'development' | 'qa' | 'staging' | 'production';

export const ENV_CONFIG = {
  environment: (import.meta.env.VITE_APP_ENV || 'development') as AppEnvironment,
  isDevelopment: import.meta.env.VITE_APP_ENV === 'development',
  isQA: import.meta.env.VITE_APP_ENV === 'qa',
  isStaging: import.meta.env.VITE_APP_ENV === 'staging',
  isProduction: import.meta.env.VITE_APP_ENV === 'production',
} as const;

export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '90000', 10),
  longTimeout: 180000, // 3 minutes for LLM operations
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  WORKSPACES: '/workspaces',
  WORKSPACE_DETAIL: '/workspaces/:workspaceId',
  WORKSPACE_CHAT: '/workspaces/:workspaceId/chat',
  WORKSPACE_CHAT_CONVERSATION: '/workspaces/:workspaceId/chat/:conversationId',
  WORKSPACE_SOURCES: '/workspaces/:workspaceId/sources',
  WORKSPACE_ENTITIES: '/workspaces/:workspaceId/entities',
  WORKSPACE_GLOSSARY: '/workspaces/:workspaceId/glossary',
  WORKSPACE_INSIGHTS: '/workspaces/:workspaceId/insights',
  WORKSPACE_SETTINGS: '/workspaces/:workspaceId/settings',
  NOT_FOUND: '/404',
} as const;

export const LOCAL_STORAGE_KEYS = {
  THEME: 'kb-theme',
  AUTH_TOKEN: 'kb-auth-token',
  REFRESH_TOKEN: 'kb-refresh-token',
  WORKSPACE_ID: 'kb-workspace-id',
  USER_PREFERENCES: 'kb-user-preferences',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const FILE_UPLOAD = {
  MAX_SIZE: 100 * 1024 * 1024, // 100MB
  ACCEPTED_DOCUMENT_TYPES: [
    'application/pdf',
    'text/plain',
    'text/markdown',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
  ],
} as const;

export const TOAST_DURATION = {
  SUCCESS: 3000,
  ERROR: 5000,
  WARNING: 4000,
  INFO: 3000,
} as const;

export const DEBOUNCE_DELAY = 300;
