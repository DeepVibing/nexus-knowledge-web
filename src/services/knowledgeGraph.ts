/**
 * Knowledge Graph Service for Nexus Knowledge
 * Aligned to swagger v3 API paths
 */

import { apiClient } from '../lib/api-client';
import type {
  GraphResponseDto,
  GraphParams,
  NeighborsParams,
  FindPathsParams,
  PathsResponseDto,
  CommunityResponseDto,
  CommunityDetectionResponseDto,
  DetectCommunitiesRequest,
  GraphSearchRequest,
  GraphSearchResponseDto,
  InfluentialEntityDto,
  InfluentialParams,
} from '../types';

const getBaseUrl = (workspaceId: string) => `/api/v1/kb/workspaces/${workspaceId}/graph`;

export const knowledgeGraphApi = {
  /** GET /graph — full graph visualization data */
  getGraph: async (workspaceId: string, params: GraphParams = {}): Promise<GraphResponseDto> => {
    const queryParams = new URLSearchParams();
    if (params.entityTypes?.length) queryParams.set('entityTypes', params.entityTypes.join(','));
    if (params.minConnections) queryParams.set('minConnections', params.minConnections.toString());
    if (params.communityId) queryParams.set('communityId', params.communityId);

    const url = `${getBaseUrl(workspaceId)}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.getRaw<GraphResponseDto>(url);
  },

  /** GET /graph/nodes/{entityId}/neighbors — K-hop neighbor traversal */
  getNeighbors: async (
    workspaceId: string,
    entityId: string,
    params: NeighborsParams = {}
  ): Promise<GraphResponseDto> => {
    const queryParams = new URLSearchParams();
    if (params.depth) queryParams.set('depth', params.depth.toString());
    if (params.entityTypes?.length) queryParams.set('entityTypes', params.entityTypes.join(','));

    const url = `${getBaseUrl(workspaceId)}/nodes/${entityId}/neighbors${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.getRaw<GraphResponseDto>(url);
  },

  /** GET /graph/paths — find paths between two entities */
  findPaths: async (workspaceId: string, params: FindPathsParams): Promise<PathsResponseDto> => {
    const queryParams = new URLSearchParams();
    queryParams.set('fromEntityId', params.fromEntityId);
    queryParams.set('toEntityId', params.toEntityId);
    if (params.maxDepth) queryParams.set('maxDepth', params.maxDepth.toString());

    return apiClient.getRaw<PathsResponseDto>(`${getBaseUrl(workspaceId)}/paths?${queryParams.toString()}`);
  },

  /** GET /graph/communities — list communities */
  getCommunities: async (workspaceId: string): Promise<CommunityResponseDto[]> => {
    return apiClient.getRaw<CommunityResponseDto[]>(`${getBaseUrl(workspaceId)}/communities`);
  },

  /** POST /graph/communities/detect — trigger community detection */
  detectCommunities: async (
    workspaceId: string,
    data: DetectCommunitiesRequest = {}
  ): Promise<CommunityDetectionResponseDto> => {
    return apiClient.postRaw<CommunityDetectionResponseDto>(
      `${getBaseUrl(workspaceId)}/communities/detect`,
      data
    );
  },

  /** POST /graph/search — semantic graph search */
  search: async (workspaceId: string, data: GraphSearchRequest): Promise<GraphSearchResponseDto> => {
    return apiClient.postRaw<GraphSearchResponseDto>(`${getBaseUrl(workspaceId)}/search`, data);
  },

  /** GET /graph/influential — top influential entities */
  getInfluential: async (
    workspaceId: string,
    params: InfluentialParams = {}
  ): Promise<InfluentialEntityDto[]> => {
    const queryParams = new URLSearchParams();
    if (params.metric) queryParams.set('metric', params.metric);
    if (params.limit) queryParams.set('limit', params.limit.toString());
    if (params.entityType) queryParams.set('entityType', params.entityType);

    const url = `${getBaseUrl(workspaceId)}/influential${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.getRaw<InfluentialEntityDto[]>(url);
  },
};

export default knowledgeGraphApi;
