/**
 * Exports Hooks for Nexus Knowledge
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { exportsApi } from '../services/exports';
import { kbKeys } from '../types';
import type { CreateExportRequest, ExportListParams } from '../types';

/**
 * List export history
 */
export function useExportHistory(workspaceId: string | undefined, params: ExportListParams = {}) {
  return useQuery({
    queryKey: kbKeys.exports.list(workspaceId ?? '', params as Record<string, unknown>),
    queryFn: () => exportsApi.list(workspaceId!, params),
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Get export job status (polls while processing)
 */
export function useExportJob(workspaceId: string | undefined, jobId: string | undefined) {
  return useQuery({
    queryKey: kbKeys.exports.job(workspaceId ?? '', jobId ?? ''),
    queryFn: () => exportsApi.getJob(workspaceId!, jobId!),
    enabled: !!workspaceId && !!jobId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === 'completed' || status === 'failed') {
        return false;
      }
      return 2000;
    },
  });
}

/**
 * Create export job
 */
export function useCreateExport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      data,
    }: {
      workspaceId: string;
      data: CreateExportRequest;
    }) => exportsApi.create(workspaceId, data),
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: kbKeys.exports.all(workspaceId) });
    },
  });
}

/**
 * Download export file
 */
export function useDownloadExport() {
  return useMutation({
    mutationFn: ({
      workspaceId,
      jobId,
      filename,
    }: {
      workspaceId: string;
      jobId: string;
      filename?: string;
    }) => exportsApi.download(workspaceId, jobId).then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `export-${jobId}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }),
  });
}
