/**
 * Entity Types for Nexus Knowledge
 */

export type EntityType =
  | 'person'
  | 'company'
  | 'project'
  | 'tool'
  | 'concept'
  | 'event'
  | 'location'
  | 'document'
  | 'term';

export interface EntityDto {
  id: string;
  workspaceId: string;
  entityType: EntityType;
  name: string;
  aliases?: string[];
  description?: string;
  attributes: Record<string, unknown>;
  relationshipsCount: number;
  mentionsCount: number;
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EntityDetailDto extends EntityDto {
  relationships: EntityRelationship[];
  mentions: EntityMention[];
}

export interface EntityRelationship {
  targetEntityId: string;
  targetEntityName: string;
  targetEntityType: EntityType;
  relationshipType: string;
  strength?: number;
  sourceId?: string;
}

export interface EntityMention {
  sourceId: string;
  sourceName: string;
  chunkId: string;
  context: string;
  pageNumber?: number;
  timestamp?: { start: number; end: number };
  confidence: number;
}

export interface CreateEntityRequest {
  entityType: EntityType;
  name: string;
  aliases?: string[];
  description?: string;
  attributes?: Record<string, unknown>;
  tags?: string[];
}

export interface UpdateEntityRequest {
  name?: string;
  aliases?: string[];
  description?: string;
  attributes?: Record<string, unknown>;
  notes?: string;
  tags?: string[];
}

export interface ExtractEntitiesRequest {
  sourceIds?: string[];
  entityTypes?: EntityType[];
  options?: ExtractEntitiesOptions;
}

export interface ExtractEntitiesOptions {
  mergeExisting?: boolean;
  confidenceThreshold?: number;
  includeRelationships?: boolean;
}

export interface ExtractEntitiesJobDto {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  results?: {
    entitiesCreated: number;
    entitiesMerged: number;
    relationshipsCreated: number;
  };
  entities?: { id: string; name: string; type: EntityType }[];
  completedAt?: string;
}

export interface MergeEntitiesRequest {
  sourceEntityId: string;
  targetEntityId: string;
  mergeAliases?: boolean;
  mergeRelationships?: boolean;
  mergeMentions?: boolean;
}

export interface EntityListParams {
  entityType?: EntityType;
  search?: string;
  tags?: string[];
  relatedTo?: string;
  mentionedIn?: string;
  page?: number;
  pageSize?: number;
}

export interface EntityListResponse {
  data: EntityDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
