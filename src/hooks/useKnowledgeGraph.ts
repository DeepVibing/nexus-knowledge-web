/**
 * Knowledge Graph Hooks for Nexus Knowledge
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { knowledgeGraphApi } from '../services/knowledgeGraph';
import { kbKeys } from '../types';
import type {
  GraphParams,
  NeighborsParams,
  FindPathsParams,
  DetectCommunitiesRequest,
  GraphSearchRequest,
  InfluentialParams,
} from '../types';

/**
 * Get full graph visualization data
 */
export function useGraphData(workspaceId: string | undefined, params: GraphParams = {}) {
  return useQuery({
    queryKey: kbKeys.graph.data(workspaceId ?? '', params as Record<string, unknown>),
    queryFn: () => knowledgeGraphApi.getGraph(workspaceId!, params),
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Get K-hop neighbors of a node
 */
export function useNodeNeighbors(
  workspaceId: string | undefined,
  entityId: string | undefined,
  params: NeighborsParams = {}
) {
  return useQuery({
    queryKey: kbKeys.graph.neighbors(workspaceId ?? '', entityId ?? '', params as Record<string, unknown>),
    queryFn: () => knowledgeGraphApi.getNeighbors(workspaceId!, entityId!, params),
    enabled: !!workspaceId && !!entityId,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Find paths between two entities
 */
export function useFindPaths(
  workspaceId: string | undefined,
  params: FindPathsParams | undefined
) {
  return useQuery({
    queryKey: kbKeys.graph.paths(workspaceId ?? '', params?.fromEntityId ?? '', params?.toEntityId ?? ''),
    queryFn: () => knowledgeGraphApi.findPaths(workspaceId!, params!),
    enabled: !!workspaceId && !!params?.fromEntityId && !!params?.toEntityId,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Get community clusters
 */
export function useCommunities(workspaceId: string | undefined) {
  return useQuery({
    queryKey: kbKeys.graph.communities(workspaceId ?? ''),
    queryFn: () => knowledgeGraphApi.getCommunities(workspaceId!),
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Trigger community detection
 */
export function useDetectCommunities() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      data,
    }: {
      workspaceId: string;
      data?: DetectCommunitiesRequest;
    }) => knowledgeGraphApi.detectCommunities(workspaceId, data),
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: kbKeys.graph.communities(workspaceId) });
      queryClient.invalidateQueries({ queryKey: kbKeys.graph.all(workspaceId) });
    },
  });
}

/**
 * Semantic graph search
 */
export function useGraphSearch() {
  return useMutation({
    mutationFn: ({
      workspaceId,
      data,
    }: {
      workspaceId: string;
      data: GraphSearchRequest;
    }) => knowledgeGraphApi.search(workspaceId, data),
  });
}

/**
 * Get influential entities
 */
export function useInfluentialEntities(workspaceId: string | undefined, params: InfluentialParams = {}) {
  return useQuery({
    queryKey: kbKeys.graph.influential(workspaceId ?? '', params as Record<string, unknown>),
    queryFn: () => knowledgeGraphApi.getInfluential(workspaceId!, params),
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 5,
  });
}
