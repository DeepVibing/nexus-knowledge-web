/**
 * Sources Hooks for Nexus Knowledge
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sourcesApi } from '../services/sources';
import { kbKeys } from '../types';
import type {
  SourceListParams,
  AddSourceUrlRequest,
  AddSourceConnectRequest,
  SyncSourceRequest,
} from '../types';

/**
 * List sources
 */
export function useSources(workspaceId: string | undefined, params: SourceListParams = {}) {
  return useQuery({
    queryKey: kbKeys.sources.list(workspaceId ?? '', params as Record<string, unknown>),
    queryFn: () => sourcesApi.list(workspaceId!, params),
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Get source detail
 */
export function useSource(workspaceId: string | undefined, sourceId: string | undefined) {
  return useQuery({
    queryKey: kbKeys.sources.detail(workspaceId ?? '', sourceId ?? ''),
    queryFn: () => sourcesApi.get(workspaceId!, sourceId!),
    enabled: !!workspaceId && !!sourceId,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Upload source file
 */
export function useUploadSource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      file,
      name,
    }: {
      workspaceId: string;
      file: File;
      name?: string;
    }) => sourcesApi.upload(workspaceId, file, name),
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: kbKeys.sources.all(workspaceId) });
    },
  });
}

/**
 * Add source from URL
 */
export function useAddSourceUrl() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, data }: { workspaceId: string; data: AddSourceUrlRequest }) =>
      sourcesApi.addUrl(workspaceId, data),
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: kbKeys.sources.all(workspaceId) });
    },
  });
}

/**
 * Connect source from integration
 */
export function useConnectSource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, data }: { workspaceId: string; data: AddSourceConnectRequest }) =>
      sourcesApi.connect(workspaceId, data),
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: kbKeys.sources.all(workspaceId) });
    },
  });
}

/**
 * Sync source
 */
export function useSyncSource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      sourceId,
      data,
    }: {
      workspaceId: string;
      sourceId: string;
      data?: SyncSourceRequest;
    }) => sourcesApi.sync(workspaceId, sourceId, data),
    onSuccess: (_, { workspaceId, sourceId }) => {
      queryClient.invalidateQueries({ queryKey: kbKeys.sources.detail(workspaceId, sourceId) });
    },
  });
}

/**
 * Delete source
 */
export function useDeleteSource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, sourceId }: { workspaceId: string; sourceId: string }) =>
      sourcesApi.delete(workspaceId, sourceId),
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: kbKeys.sources.all(workspaceId) });
    },
  });
}

/**
 * Get source processing job status
 */
export function useSourceJob(
  workspaceId: string | undefined,
  sourceId: string | undefined,
  jobId: string | undefined
) {
  return useQuery({
    queryKey: kbKeys.sources.job(workspaceId ?? '', sourceId ?? '', jobId ?? ''),
    queryFn: () => sourcesApi.getJob(workspaceId!, sourceId!, jobId!),
    enabled: !!workspaceId && !!sourceId && !!jobId,
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
 * Trigger visual intelligence analysis on an image source
 */
export function useAnalyzeSource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, sourceId }: { workspaceId: string; sourceId: string }) =>
      sourcesApi.analyze(workspaceId, sourceId),
    onSuccess: (_, { workspaceId, sourceId }) => {
      queryClient.invalidateQueries({ queryKey: kbKeys.sources.detail(workspaceId, sourceId) });
    },
  });
}

/**
 * Get visual analysis results for a source
 */
export function useSourceAnalysis(workspaceId: string | undefined, sourceId: string | undefined) {
  return useQuery({
    queryKey: [...kbKeys.sources.detail(workspaceId ?? '', sourceId ?? ''), 'analysis'] as const,
    queryFn: () => sourcesApi.getAnalysis(workspaceId!, sourceId!),
    enabled: !!workspaceId && !!sourceId,
    staleTime: 1000 * 60 * 5,
  });
}
