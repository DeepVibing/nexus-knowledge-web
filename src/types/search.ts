/**
 * Search Types for Nexus Knowledge
 */

import type { SourceType } from './source';
import type { EntityType } from './entity';
import type { DateRange } from './common';

export type SearchMode = 'semantic' | 'keyword' | 'hybrid';

export interface SearchRequest {
  query: string;
  limit?: number;
  offset?: number;
  filters?: SearchFilters;
  options?: SearchOptions;
}

export interface SearchFilters {
  sourceIds?: string[];
  sourceTypes?: SourceType[];
  entityTypes?: EntityType[];
  dateRange?: DateRange;
  tags?: string[];
}

export interface SearchOptions {
  mode?: SearchMode;
  includeChunks?: boolean;
  includeEntities?: boolean;
  highlightMatches?: boolean;
}

export interface SearchResponse {
  results: SearchResult[];
  totalCount: number;
  facets?: SearchFacets;
}

export interface SearchResult {
  type: 'chunk' | 'entity' | 'insight';
  id: string;
  score: number;
  // For chunks
  sourceId?: string;
  sourceName?: string;
  content?: string;
  pageNumber?: number;
  // For entities
  entityType?: string;
  name?: string;
  description?: string;
  // Common
  highlights?: string[];
}

export interface SearchFacets {
  sourceTypes: FacetCount[];
  dateRanges: FacetCount[];
}

export interface FacetCount {
  value: string;
  count: number;
}
