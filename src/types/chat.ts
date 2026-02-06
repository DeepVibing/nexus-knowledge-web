/**
 * Chat Types for Nexus Knowledge
 */

import type { SourceType } from './source';
import type { DateRange } from './common';

export type CitationMode = 'inline' | 'footnotes' | 'none';
export type ResponseFormat = 'concise' | 'detailed' | 'bullets';

export interface AskRequest {
  question: string;
  conversationId?: string;
  filters?: AskFilters;
  options?: AskOptions;
}

export interface AskFilters {
  sourceIds?: string[];
  sourceTypes?: SourceType[];
  dateRange?: DateRange;
  tags?: string[];
}

export interface AskOptions {
  includeThinking?: boolean;
  citationMode?: CitationMode;
  responseFormat?: ResponseFormat;
  maxSources?: number;
}

export interface AskResponse {
  answer: string;
  citations: Citation[];
  thinking?: string;
  relatedEntities?: EntitySummary[];
  suggestedFollowUps?: string[];
  conversationId: string;
  messageId: string;
  usage?: TokenUsage;
}

export interface Citation {
  id: string;
  sourceId: string;
  sourceName: string;
  sourceType?: SourceType;
  chunkId: string;
  text: string;
  relevanceScore: number;
  pageNumber?: number;
  timestamp?: { start: number; end: number };
}

export interface EntitySummary {
  id: string;
  name: string;
  type: string;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  retrievedChunks: number;
}

export interface ConversationListDto {
  id: string;
  title?: string;
  messageCount: number;
  sourcesUsed: string[];
  lastMessageAt: string;
  createdAt: string;
}

export interface ConversationDto {
  id: string;
  workspaceId: string;
  title?: string;
  messages: ConversationMessage[];
  sourcesUsed: string[];
  entitiesDiscussed: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  entityReferences?: string[];
  thinking?: string;
  createdAt: string;
}

export interface ConversationListParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface ConversationListResponse {
  data: ConversationListDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
