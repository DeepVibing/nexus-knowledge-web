/**
 * Insights Service for Nexus Knowledge
 */

import { apiClient } from '../lib/api-client';
import type {
  InsightDto,
  InsightListResponse,
  InsightListParams,
  InsightStatsDto,
  CreateInsightRequest,
  UpdateInsightRequest,
  CaptureInsightRequest,
} from '../types';

const getBaseUrl = (workspaceId: string) => `/api/v1/kb/workspaces/${workspaceId}/insights`;

export const insightsApi = {
  list: async (workspaceId: string, params: InsightListParams = {}): Promise<InsightListResponse> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.set('page', params.page.toString());
    if (params.pageSize) queryParams.set('pageSize', params.pageSize.toString());
    if (params.type) queryParams.set('type', params.type);
    if (params.status) queryParams.set('status', params.status);
    if (params.assignee) queryParams.set('assignee', params.assignee);
    if (params.search) queryParams.set('search', params.search);

    const url = `${getBaseUrl(workspaceId)}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.getRaw<InsightListResponse>(url);
  },

  getStats: async (workspaceId: string): Promise<InsightStatsDto> => {
    return apiClient.getRaw<InsightStatsDto>(`${getBaseUrl(workspaceId)}/stats`);
  },

  get: async (workspaceId: string, insightId: string): Promise<InsightDto> => {
    return apiClient.getRaw<InsightDto>(`${getBaseUrl(workspaceId)}/${insightId}`);
  },

  create: async (workspaceId: string, data: CreateInsightRequest): Promise<InsightDto> => {
    return apiClient.postRaw<InsightDto>(getBaseUrl(workspaceId), data);
  },

  capture: async (workspaceId: string, data: CaptureInsightRequest): Promise<InsightDto> => {
    return apiClient.postRaw<InsightDto>(`${getBaseUrl(workspaceId)}/capture`, data);
  },

  update: async (workspaceId: string, insightId: string, data: UpdateInsightRequest): Promise<InsightDto> => {
    return apiClient.putRaw<InsightDto>(`${getBaseUrl(workspaceId)}/${insightId}`, data);
  },

  delete: async (workspaceId: string, insightId: string): Promise<void> => {
    await apiClient.deleteRaw(`${getBaseUrl(workspaceId)}/${insightId}`);
  },
};

export default insightsApi;
