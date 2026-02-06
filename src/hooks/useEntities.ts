/**
 * Entities Hooks for Nexus Knowledge
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { entitiesApi } from '../services/entities';
import { kbKeys } from '../types';
import type {
  EntityListParams,
  CreateEntityRequest,
  UpdateEntityRequest,
  ExtractEntitiesRequest,
  MergeEntitiesRequest,
} from '../types';

/**
 * List entities
 */
export function useEntities(workspaceId: string | undefined, params: EntityListParams = {}) {
  return useQuery({
    queryKey: kbKeys.entities.list(workspaceId ?? '', params as Record<string, unknown>),
    queryFn: () => entitiesApi.list(workspaceId!, params),
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Get entity detail
 */
export function useEntity(workspaceId: string | undefined, entityId: string | undefined) {
  return useQuery({
    queryKey: kbKeys.entities.detail(workspaceId ?? '', entityId ?? ''),
    queryFn: () => entitiesApi.get(workspaceId!, entityId!),
    enabled: !!workspaceId && !!entityId,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Create entity
 */
export function useCreateEntity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, data }: { workspaceId: string; data: CreateEntityRequest }) =>
      entitiesApi.create(workspaceId, data),
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: kbKeys.entities.all(workspaceId) });
    },
  });
}

/**
 * Update entity
 */
export function useUpdateEntity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      entityId,
      data,
    }: {
      workspaceId: string;
      entityId: string;
      data: UpdateEntityRequest;
    }) => entitiesApi.update(workspaceId, entityId, data),
    onSuccess: (_, { workspaceId, entityId }) => {
      queryClient.invalidateQueries({ queryKey: kbKeys.entities.detail(workspaceId, entityId) });
      queryClient.invalidateQueries({ queryKey: kbKeys.entities.all(workspaceId) });
    },
  });
}

/**
 * Delete entity
 */
export function useDeleteEntity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, entityId }: { workspaceId: string; entityId: string }) =>
      entitiesApi.delete(workspaceId, entityId),
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: kbKeys.entities.all(workspaceId) });
    },
  });
}

/**
 * Extract entities from sources
 */
export function useExtractEntities() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, data }: { workspaceId: string; data: ExtractEntitiesRequest }) =>
      entitiesApi.extract(workspaceId, data),
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: kbKeys.entities.all(workspaceId) });
    },
  });
}

/**
 * Get extraction job status
 */
export function useExtractionJob(workspaceId: string | undefined, jobId: string | undefined) {
  return useQuery({
    queryKey: kbKeys.entities.extractionJob(workspaceId ?? '', jobId ?? ''),
    queryFn: () => entitiesApi.getExtractionJob(workspaceId!, jobId!),
    enabled: !!workspaceId && !!jobId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === 'completed' || status === 'failed') {
        return false;
      }
      return 2000; // Poll every 2 seconds while processing
    },
  });
}

/**
 * Merge entities
 */
export function useMergeEntities() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, data }: { workspaceId: string; data: MergeEntitiesRequest }) =>
      entitiesApi.merge(workspaceId, data),
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: kbKeys.entities.all(workspaceId) });
    },
  });
}
