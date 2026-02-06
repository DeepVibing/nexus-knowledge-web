/**
 * Connectors Service for Nexus Knowledge
 */

import { apiClient } from '../lib/api-client';
import type {
  ConnectorDto,
  ConnectedIntegrationDto,
  ConnectRequestDto,
  ConnectorResourceDto,
  SyncRequestDto,
  SyncResultDto,
} from '../types';

const getWorkspaceUrl = (workspaceId: string) => `/api/v1/kb/workspaces/${workspaceId}/connectors`;

export const connectorsApi = {
  listAvailable: async (): Promise<ConnectorDto[]> => {
    return apiClient.getRaw<ConnectorDto[]>('/api/v1/kb/connectors');
  },

  listConnections: async (workspaceId: string): Promise<ConnectedIntegrationDto[]> => {
    return apiClient.getRaw<ConnectedIntegrationDto[]>(getWorkspaceUrl(workspaceId));
  },

  getConnection: async (workspaceId: string, connectionId: string): Promise<ConnectedIntegrationDto> => {
    return apiClient.getRaw<ConnectedIntegrationDto>(`${getWorkspaceUrl(workspaceId)}/${connectionId}`);
  },

  connect: async (workspaceId: string, connectorId: string, data: ConnectRequestDto): Promise<ConnectedIntegrationDto> => {
    return apiClient.postRaw<ConnectedIntegrationDto>(
      `${getWorkspaceUrl(workspaceId)}/${connectorId}/connect`,
      data
    );
  },

  disconnect: async (workspaceId: string, connectionId: string): Promise<void> => {
    await apiClient.deleteRaw(`${getWorkspaceUrl(workspaceId)}/${connectionId}`);
  },

  listResources: async (workspaceId: string, connectionId: string): Promise<ConnectorResourceDto[]> => {
    return apiClient.getRaw<ConnectorResourceDto[]>(
      `${getWorkspaceUrl(workspaceId)}/${connectionId}/resources`
    );
  },

  sync: async (workspaceId: string, connectionId: string, data?: SyncRequestDto): Promise<SyncResultDto> => {
    return apiClient.postRaw<SyncResultDto>(
      `${getWorkspaceUrl(workspaceId)}/${connectionId}/sync`,
      data
    );
  },
};

export default connectorsApi;
