/**
 * Exports Service for Nexus Knowledge
 */

import { apiClient } from '../lib/api-client';
import type {
  ExportJobDto,
  CreateExportRequest,
  ExportListParams,
} from '../types';

const getBaseUrl = (workspaceId: string) => `/api/v1/kb/workspaces/${workspaceId}/export`;

export const exportsApi = {
  create: async (workspaceId: string, data: CreateExportRequest): Promise<ExportJobDto> => {
    return apiClient.postRaw<ExportJobDto>(getBaseUrl(workspaceId), data);
  },

  list: async (workspaceId: string, params: ExportListParams = {}): Promise<ExportJobDto[]> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.set('page', params.page.toString());
    if (params.pageSize) queryParams.set('pageSize', params.pageSize.toString());

    const url = `${getBaseUrl(workspaceId)}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.getRaw<ExportJobDto[]>(url);
  },

  getJob: async (workspaceId: string, jobId: string): Promise<ExportJobDto> => {
    return apiClient.getRaw<ExportJobDto>(`${getBaseUrl(workspaceId)}/${jobId}`);
  },

  download: async (workspaceId: string, jobId: string): Promise<Blob> => {
    const response = await apiClient.client.get(`${getBaseUrl(workspaceId)}/${jobId}/download`, {
      responseType: 'blob',
    });
    return response.data as Blob;
  },
};

export default exportsApi;
