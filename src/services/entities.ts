/**
 * Entities Service for Nexus Knowledge
 */

import { apiClient } from '../lib/api-client';
import type {
  EntityDto,
  EntityDetailDto,
  EntityListParams,
  EntityListResponse,
  CreateEntityRequest,
  UpdateEntityRequest,
  ExtractEntitiesRequest,
  ExtractEntitiesJobDto,
  MergeEntitiesRequest,
} from '../types';

const getBaseUrl = (workspaceId: string) => `/api/v1/kb/workspaces/${workspaceId}/entities`;

export const entitiesApi = {
  list: async (workspaceId: string, params: EntityListParams = {}): Promise<EntityListResponse> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.set('page', params.page.toString());
    if (params.pageSize) queryParams.set('pageSize', params.pageSize.toString());
    if (params.entityType) queryParams.set('entityType', params.entityType);
    if (params.search) queryParams.set('search', params.search);
    if (params.tags?.length) queryParams.set('tags', params.tags.join(','));
    if (params.relatedTo) queryParams.set('relatedTo', params.relatedTo);
    if (params.mentionedIn) queryParams.set('mentionedIn', params.mentionedIn);

    const url = `${getBaseUrl(workspaceId)}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.getRaw<EntityListResponse>(url);
  },

  get: async (workspaceId: string, id: string): Promise<EntityDetailDto> => {
    return apiClient.getRaw<EntityDetailDto>(`${getBaseUrl(workspaceId)}/${id}`);
  },

  create: async (workspaceId: string, data: CreateEntityRequest): Promise<EntityDto> => {
    return apiClient.postRaw<EntityDto>(getBaseUrl(workspaceId), data);
  },

  update: async (workspaceId: string, id: string, data: UpdateEntityRequest): Promise<EntityDto> => {
    return apiClient.putRaw<EntityDto>(`${getBaseUrl(workspaceId)}/${id}`, data);
  },

  delete: async (workspaceId: string, id: string): Promise<void> => {
    await apiClient.deleteRaw(`${getBaseUrl(workspaceId)}/${id}`);
  },

  extract: async (workspaceId: string, data: ExtractEntitiesRequest): Promise<ExtractEntitiesJobDto> => {
    return apiClient.postRaw<ExtractEntitiesJobDto>(`${getBaseUrl(workspaceId)}/extract`, data);
  },

  getExtractionJob: async (workspaceId: string, jobId: string): Promise<ExtractEntitiesJobDto> => {
    return apiClient.getRaw<ExtractEntitiesJobDto>(
      `${getBaseUrl(workspaceId)}/extraction-jobs/${jobId}`
    );
  },

  merge: async (workspaceId: string, data: MergeEntitiesRequest): Promise<EntityDto> => {
    return apiClient.postRaw<EntityDto>(`${getBaseUrl(workspaceId)}/merge`, data);
  },
};

export default entitiesApi;
