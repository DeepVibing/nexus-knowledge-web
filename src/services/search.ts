/**
 * Search Service for Nexus Knowledge
 */

import { apiClient } from '../lib/api-client';
import type { SearchRequest, SearchResponse } from '../types';

const getBaseUrl = (workspaceId: string) => `/api/v1/kb/workspaces/${workspaceId}/search`;

export const searchApi = {
  search: async (workspaceId: string, data: SearchRequest): Promise<SearchResponse> => {
    return apiClient.postRaw<SearchResponse>(getBaseUrl(workspaceId), data);
  },
};

export default searchApi;
