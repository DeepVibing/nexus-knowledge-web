/**
 * Connectors Hooks for Nexus Knowledge
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { connectorsApi } from '../services/connectors';
import { kbKeys } from '../types';
import type { ConnectRequestDto, SyncRequestDto } from '../types';

/**
 * List available connectors (system-level, no workspaceId)
 */
export function useAvailableConnectors() {
  return useQuery({
    queryKey: kbKeys.connectors.available(),
    queryFn: () => connectorsApi.listAvailable(),
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * List workspace connections
 */
export function useWorkspaceConnections(workspaceId: string | undefined) {
  return useQuery({
    queryKey: kbKeys.connectors.connectionList(workspaceId ?? ''),
    queryFn: () => connectorsApi.listConnections(workspaceId!),
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Get connection detail
 */
export function useConnection(workspaceId: string | undefined, connectionId: string | undefined) {
  return useQuery({
    queryKey: kbKeys.connectors.connectionDetail(workspaceId ?? '', connectionId ?? ''),
    queryFn: () => connectorsApi.getConnection(workspaceId!, connectionId!),
    enabled: !!workspaceId && !!connectionId,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Connect integration
 */
export function useConnectIntegration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      connectorId,
      data,
    }: {
      workspaceId: string;
      connectorId: string;
      data: ConnectRequestDto;
    }) => connectorsApi.connect(workspaceId, connectorId, data),
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: kbKeys.connectors.connections(workspaceId) });
    },
  });
}

/**
 * Disconnect integration
 */
export function useDisconnectIntegration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      connectionId,
    }: {
      workspaceId: string;
      connectionId: string;
    }) => connectorsApi.disconnect(workspaceId, connectionId),
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: kbKeys.connectors.connections(workspaceId) });
    },
  });
}

/**
 * List connector resources
 */
export function useConnectorResources(workspaceId: string | undefined, connectionId: string | undefined) {
  return useQuery({
    queryKey: kbKeys.connectors.resources(workspaceId ?? '', connectionId ?? ''),
    queryFn: () => connectorsApi.listResources(workspaceId!, connectionId!),
    enabled: !!workspaceId && !!connectionId,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Sync connector
 */
export function useSyncConnector() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      connectionId,
      data,
    }: {
      workspaceId: string;
      connectionId: string;
      data?: SyncRequestDto;
    }) => connectorsApi.sync(workspaceId, connectionId, data),
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: kbKeys.connectors.connections(workspaceId) });
    },
  });
}
