/**
 * Glossary Service for Nexus Knowledge
 */

import { apiClient } from '../lib/api-client';
import type {
  GlossaryTermDto,
  GlossaryTermListResponse,
  GlossaryTermListParams,
  CreateGlossaryTermRequest,
  UpdateGlossaryTermRequest,
} from '../types';

const getBaseUrl = (workspaceId: string) => `/api/v1/kb/workspaces/${workspaceId}/glossary`;

export const glossaryApi = {
  list: async (workspaceId: string, params: GlossaryTermListParams = {}): Promise<GlossaryTermListResponse> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.set('page', params.page.toString());
    if (params.pageSize) queryParams.set('pageSize', params.pageSize.toString());
    if (params.search) queryParams.set('search', params.search);
    if (params.category) queryParams.set('category', params.category);

    const url = `${getBaseUrl(workspaceId)}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.getRaw<GlossaryTermListResponse>(url);
  },

  getCategories: async (workspaceId: string): Promise<string[]> => {
    return apiClient.getRaw<string[]>(`${getBaseUrl(workspaceId)}/categories`);
  },

  get: async (workspaceId: string, termId: string): Promise<GlossaryTermDto> => {
    return apiClient.getRaw<GlossaryTermDto>(`${getBaseUrl(workspaceId)}/${termId}`);
  },

  create: async (workspaceId: string, data: CreateGlossaryTermRequest): Promise<GlossaryTermDto> => {
    return apiClient.postRaw<GlossaryTermDto>(getBaseUrl(workspaceId), data);
  },

  update: async (workspaceId: string, termId: string, data: UpdateGlossaryTermRequest): Promise<GlossaryTermDto> => {
    return apiClient.putRaw<GlossaryTermDto>(`${getBaseUrl(workspaceId)}/${termId}`, data);
  },

  delete: async (workspaceId: string, termId: string): Promise<void> => {
    await apiClient.deleteRaw(`${getBaseUrl(workspaceId)}/${termId}`);
  },
};

export default glossaryApi;
