/**
 * Insight Types for Nexus Knowledge
 */

export type InsightType = 'decision' | 'action_item' | 'finding' | 'question';
export type InsightStatus = 'open' | 'resolved' | 'deferred';

export interface InsightDto {
  id: string;
  type: InsightType;
  title: string;
  content: string;
  status: InsightStatus;
  assignee: string | null;
  dueDate: string | null;
  conversationId: string | null;
  tags: string[];
  sourceIds: string[];
  linkedEntities: string[];
  createdByUserId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InsightListResponse {
  data: InsightDto[];
  total: number;
  page: number;
  pageSize: number;
}

export interface InsightListParams {
  type?: InsightType;
  status?: InsightStatus;
  assignee?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface InsightStatsDto {
  open: number;
  resolved: number;
  deferred: number;
}

export interface CreateInsightRequest {
  type: InsightType;
  title: string;
  content: string;
  assignee?: string;
  dueDate?: string;
  tags?: string[];
  sourceIds?: string[];
  linkedEntities?: string[];
}

export interface UpdateInsightRequest {
  type?: InsightType;
  title?: string;
  content?: string;
  status?: InsightStatus;
  assignee?: string;
  dueDate?: string;
  tags?: string[];
  sourceIds?: string[];
  linkedEntities?: string[];
}

export interface CaptureInsightRequest {
  conversationId: string;
  messageIds?: string[];
  type?: InsightType;
  title?: string;
  tags?: string[];
}
