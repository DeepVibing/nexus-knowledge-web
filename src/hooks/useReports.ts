/**
 * Reports Hooks for Nexus Knowledge
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsApi } from '../services/reports';
import { kbKeys } from '../types';
import type { ReportListParams, CreateReportRequest } from '../types';

/**
 * List generated reports
 */
export function useReports(workspaceId: string | undefined, params: ReportListParams = {}) {
  return useQuery({
    queryKey: kbKeys.reports.list(workspaceId ?? '', params as Record<string, unknown>),
    queryFn: () => reportsApi.list(workspaceId!, params),
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Get report detail
 */
export function useReport(workspaceId: string | undefined, reportId: string | undefined) {
  return useQuery({
    queryKey: kbKeys.reports.detail(workspaceId ?? '', reportId ?? ''),
    queryFn: () => reportsApi.get(workspaceId!, reportId!),
    enabled: !!workspaceId && !!reportId,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Generate a new report (creates async job)
 */
export function useGenerateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      data,
    }: {
      workspaceId: string;
      data: CreateReportRequest;
    }) => reportsApi.create(workspaceId, data),
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: kbKeys.reports.all(workspaceId) });
    },
  });
}

/**
 * Poll report job status
 */
export function useReportJobStatus(workspaceId: string | undefined, jobId: string | undefined) {
  return useQuery({
    queryKey: kbKeys.reports.job(workspaceId ?? '', jobId ?? ''),
    queryFn: () => reportsApi.getJobStatus(workspaceId!, jobId!),
    enabled: !!workspaceId && !!jobId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === 'completed' || status === 'failed') {
        return false;
      }
      return 3000; // Poll every 3 seconds while generating
    },
  });
}

/**
 * Delete a report
 */
export function useDeleteReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      reportId,
    }: {
      workspaceId: string;
      reportId: string;
    }) => reportsApi.delete(workspaceId, reportId),
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: kbKeys.reports.all(workspaceId) });
    },
  });
}
