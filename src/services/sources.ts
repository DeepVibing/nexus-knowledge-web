/**
 * Sources Service for Nexus Knowledge
 */

import { apiClient } from '../lib/api-client';
import type {
  SourceDto,
  SourceListParams,
  SourceListResponse,
  SourceProcessingJobDto,
  AddSourceUrlRequest,
  AddSourceConnectRequest,
  SyncSourceRequest,
} from '../types';

const getBaseUrl = (workspaceId: string) => `/api/v1/kb/workspaces/${workspaceId}/sources`;

export const sourcesApi = {
  list: async (workspaceId: string, params: SourceListParams = {}): Promise<SourceListResponse> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.set('page', params.page.toString());
    if (params.pageSize) queryParams.set('pageSize', params.pageSize.toString());
    if (params.status) queryParams.set('status', params.status);
    if (params.sourceType) queryParams.set('sourceType', params.sourceType);
    if (params.search) queryParams.set('search', params.search);
    if (params.tags?.length) queryParams.set('tags', params.tags.join(','));

    const url = `${getBaseUrl(workspaceId)}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.getRaw<SourceListResponse>(url);
  },

  get: async (workspaceId: string, id: string): Promise<SourceDto> => {
    return apiClient.getRaw<SourceDto>(`${getBaseUrl(workspaceId)}/${id}`);
  },

  upload: async (workspaceId: string, file: File, name?: string): Promise<SourceDto> => {
    const formData = new FormData();
    formData.append('file', file);
    if (name) formData.append('name', name);
    return apiClient.postForm<SourceDto>(getBaseUrl(workspaceId), formData);
  },

  addUrl: async (workspaceId: string, data: AddSourceUrlRequest): Promise<SourceDto> => {
    return apiClient.postRaw<SourceDto>(`${getBaseUrl(workspaceId)}/url`, data);
  },

  connect: async (workspaceId: string, data: AddSourceConnectRequest): Promise<SourceDto> => {
    return apiClient.postRaw<SourceDto>(`${getBaseUrl(workspaceId)}/connect`, data);
  },

  sync: async (workspaceId: string, id: string, data?: SyncSourceRequest): Promise<SourceProcessingJobDto> => {
    return apiClient.postRaw<SourceProcessingJobDto>(
      `${getBaseUrl(workspaceId)}/${id}/sync`,
      data
    );
  },

  delete: async (workspaceId: string, id: string): Promise<void> => {
    await apiClient.deleteRaw(`${getBaseUrl(workspaceId)}/${id}`);
  },

  getJob: async (workspaceId: string, sourceId: string, jobId: string): Promise<SourceProcessingJobDto> => {
    return apiClient.getRaw<SourceProcessingJobDto>(
      `${getBaseUrl(workspaceId)}/${sourceId}/jobs/${jobId}`
    );
  },
};

export default sourcesApi;
