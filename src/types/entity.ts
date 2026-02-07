/**
 * Entity Types for Nexus Knowledge
 * Aligned to swagger v2b API shapes
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

/** List-level entity (slim shape from GET /entities) */
export interface EntityDto {
  id: string;
  type: string;
  name: string;
  aliases?: string[];
  description?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

/** Detail-level entity (GET /entities/{id}) — adds counts & notes */
export interface EntityDetailDto extends EntityDto {
  notes?: string;
  attributes?: Record<string, unknown>;
  relationshipsCount: number;
  mentionsCount: number;
}

/** Compact entity reference used inside RelationshipDto */
export interface EntityRefDto {
  id: string;
  name: string;
  type: string;
}

/** Relationship between two entities (GET /entities/{id}/relationships) */
export interface RelationshipDto {
  id: string;
  sourceEntity: EntityRefDto;
  targetEntity: EntityRefDto;
  relationshipType: string;
  strength?: number;
  createdAt: string;
}

/** Mention of an entity in a source (GET /entities/{id}/mentions) */
export interface MentionDto {
  id: string;
  sourceId: string;
  sourceName: string;
  chunkId: string;
  context: string;
  pageNumber?: number;
  confidence: number;
  createdAt: string;
}

export interface CreateEntityRequest {
  type: string;
  name: string;
  aliases?: string[];
  description?: string;
  notes?: string;
  tags?: string[];
}

export interface UpdateEntityRequest {
  name?: string;
  type?: string;
  aliases?: string[];
  description?: string;
  notes?: string;
  tags?: string[];
}

export interface ExtractEntitiesRequest {
  sourceIds?: string[];
  entityTypes?: string[];
  mergeExisting?: boolean;
  confidenceThreshold?: number;
  includeRelationships?: boolean;
}

export interface ExtractionJobDto {
  id: string;
  status: string;
  progress?: number;
  errorMessage?: string;
  result?: string;
  createdAt: string;
  completedAt?: string;
}

export interface MergeEntitiesRequest {
  targetEntityId: string;
  mergeAliases?: boolean;
  mergeRelationships?: boolean;
  mergeMentions?: boolean;
}

export interface EntityListParams {
  type?: EntityType;
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
}
