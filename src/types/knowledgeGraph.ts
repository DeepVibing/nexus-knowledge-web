/**
 * Knowledge Graph Types for Nexus Knowledge
 * Aligned to swagger v3 API schemas
 */

// --- Graph Visualization ---

export interface GraphNodeDto {
  id: string;
  name: string;
  type: string;
  description?: string;
  connectionCount: number;
  communityId?: string;
}

export interface GraphEdgeDto {
  id: string;
  sourceId: string;
  targetId: string;
  relationshipType: string;
  strength: number;
}

export interface GraphStatsDto {
  nodeCount: number;
  edgeCount: number;
  averageDegree: number;
  componentCount: number;
}

export interface GraphResponseDto {
  nodes: GraphNodeDto[];
  edges: GraphEdgeDto[];
  stats: GraphStatsDto;
}

// --- Graph Paths ---

export interface GraphPathDto {
  nodes: GraphNodeDto[];
  edges: GraphEdgeDto[];
  length: number;
  totalStrength: number;
}

export interface PathsResponseDto {
  fromEntityId: string;
  toEntityId: string;
  paths: GraphPathDto[];
  totalPaths: number;
}

// --- Communities ---

export interface CommunityResponseDto {
  id: string;
  name: string;
  summary?: string;
  algorithm: string;
  entityCount: number;
  topEntities: GraphNodeDto[];
}

export interface CommunityDetectionResponseDto {
  communitiesDetected: number;
  algorithm: string;
  communities: CommunityResponseDto[];
}

export interface DetectCommunitiesRequest {
  algorithm?: string;
  minCommunitySize?: number;
}

// --- Graph Search ---

export interface GraphSearchRequest {
  query: string;
  entityType?: string;
  limit?: number;
}

export interface GraphSearchResultDto {
  node: GraphNodeDto;
  similarity: number;
  connectedNodes: GraphNodeDto[];
}

export interface GraphSearchResponseDto {
  query: string;
  results: GraphSearchResultDto[];
  totalResults: number;
}

// --- Influential Entities ---

export interface InfluentialEntityDto {
  id: string;
  name: string;
  type: string;
  score: number;
  metric: string;
  connectionCount: number;
}

// --- Query Params ---

export interface GraphParams {
  entityTypes?: string[];
  minConnections?: number;
  communityId?: string;
}

export interface NeighborsParams {
  depth?: number;
  entityTypes?: string[];
}

export interface FindPathsParams {
  fromEntityId: string;
  toEntityId: string;
  maxDepth?: number;
}

export interface InfluentialParams {
  metric?: 'pageRank' | 'betweenness' | 'degree';
  limit?: number;
  entityType?: string;
}

// --- Entity Type Colors ---

export const ENTITY_TYPE_COLORS: Record<string, string> = {
  person: '#6366f1',
  company: '#f59e0b',
  project: '#10b981',
  tool: '#0ea5e9',
  concept: '#8b5cf6',
  event: '#14b8a6',
  location: '#ec4899',
  document: '#f97316',
  term: '#a855f7',
} as const;

export const DEFAULT_ENTITY_COLOR = '#6b7280';
