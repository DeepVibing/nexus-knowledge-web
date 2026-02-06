/**
 * Insights Hooks for Nexus Knowledge
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { insightsApi } from '../services/insights';
import { kbKeys } from '../types';
import type {
  InsightListParams,
  CreateInsightRequest,
  UpdateInsightRequest,
  CaptureInsightRequest,
} from '../types';

/**
 * List insights
 */
export function useInsights(workspaceId: string | undefined, params: InsightListParams = {}) {
  return useQuery({
    queryKey: kbKeys.insights.list(workspaceId ?? '', params as Record<string, unknown>),
    queryFn: () => insightsApi.list(workspaceId!, params),
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Get insight stats
 */
export function useInsightStats(workspaceId: string | undefined) {
  return useQuery({
    queryKey: kbKeys.insights.stats(workspaceId ?? ''),
    queryFn: () => insightsApi.getStats(workspaceId!),
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Get insight detail
 */
export function useInsight(workspaceId: string | undefined, insightId: string | undefined) {
  return useQuery({
    queryKey: kbKeys.insights.detail(workspaceId ?? '', insightId ?? ''),
    queryFn: () => insightsApi.get(workspaceId!, insightId!),
    enabled: !!workspaceId && !!insightId,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Create insight
 */
export function useCreateInsight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      data,
    }: {
      workspaceId: string;
      data: CreateInsightRequest;
    }) => insightsApi.create(workspaceId, data),
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: kbKeys.insights.all(workspaceId) });
    },
  });
}

/**
 * Capture insight from conversation
 */
export function useCaptureInsight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      data,
    }: {
      workspaceId: string;
      data: CaptureInsightRequest;
    }) => insightsApi.capture(workspaceId, data),
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: kbKeys.insights.all(workspaceId) });
    },
  });
}

/**
 * Update insight
 */
export function useUpdateInsight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      insightId,
      data,
    }: {
      workspaceId: string;
      insightId: string;
      data: UpdateInsightRequest;
    }) => insightsApi.update(workspaceId, insightId, data),
    onSuccess: (_, { workspaceId, insightId }) => {
      queryClient.invalidateQueries({ queryKey: kbKeys.insights.all(workspaceId) });
      queryClient.invalidateQueries({ queryKey: kbKeys.insights.detail(workspaceId, insightId) });
    },
  });
}

/**
 * Delete insight
 */
export function useDeleteInsight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      insightId,
    }: {
      workspaceId: string;
      insightId: string;
    }) => insightsApi.delete(workspaceId, insightId),
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: kbKeys.insights.all(workspaceId) });
    },
  });
}
