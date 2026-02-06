/**
 * Glossary Types for Nexus Knowledge
 */

export interface GlossaryTermDto {
  id: string;
  term: string;
  definition: string;
  aliases: string[];
  category: string | null;
  relatedTerms: string[];
  sourceReferences: string[];
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface GlossaryTermListResponse {
  data: GlossaryTermDto[];
  total: number;
  page: number;
  pageSize: number;
}

export interface GlossaryTermListParams {
  search?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateGlossaryTermRequest {
  term: string;
  definition: string;
  aliases?: string[];
  category?: string;
  relatedTerms?: string[];
  sourceReferences?: string[];
}

export interface UpdateGlossaryTermRequest {
  term?: string;
  definition?: string;
  aliases?: string[];
  category?: string;
  relatedTerms?: string[];
  sourceReferences?: string[];
}
