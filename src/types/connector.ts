/**
 * Connector Types for Nexus Knowledge
 */

export type ConnectorAuthType = 'api_key' | 'oauth2' | 'basic';
export type ConnectorStatus = 'available' | 'coming_soon' | 'beta';
export type ConnectionStatus = 'active' | 'expired' | 'error' | 'disconnected';

export interface ConnectorDto {
  id: string;
  name: string;
  description: string;
  icon: string;
  authType: ConnectorAuthType;
  capabilities: string[];
  syncModes: string[];
  status: ConnectorStatus;
}

export interface ConnectedIntegrationDto {
  id: string;
  connectorId: string;
  name: string;
  status: ConnectionStatus;
  lastSyncAt: string | null;
  sourcesCount: number;
  authExpiresAt: string | null;
  createdAt: string;
}

export interface ConnectRequestDto {
  apiKey?: string;
  authCode?: string;
  redirectUri?: string;
  credentials?: Record<string, string>;
}

export interface ConnectorResourceDto {
  externalId: string;
  name: string;
  type: string;
  description: string | null;
  membersCount: number | null;
  isConnected: boolean;
}

export interface SyncRequestDto {
  resourceId?: string;
}

export interface SyncResultDto {
  message: string;
  connectionId: string;
  resourceId: string | null;
}
