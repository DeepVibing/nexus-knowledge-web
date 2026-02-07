/**
 * Report Types for Nexus Knowledge
 * Aligned to swagger v3 API schemas
 */

export type ReportType =
  | 'executive_summary'
  | 'entity_map'
  | 'source_digest'
  | 'insights_report'
  | 'glossary_reference'
  | 'knowledge_timeline';

export type ReportStatus =
  | 'pending'
  | 'generating'
  | 'completed'
  | 'failed';

// --- Request DTOs ---

export interface ReportOptionsDto {
  sourceIds?: string[];
  entityTypes?: string[];
  focusTopic?: string;
  includeEntities?: boolean;
  includeInsights?: boolean;
  maxSources?: number;
}

export interface CreateReportRequest {
  type: ReportType;
  title?: string;
  options?: ReportOptionsDto;
}

// --- Response DTOs ---

export interface ReportJobResponseDto {
  id: string;
  status: ReportStatus;
  type: string;
  title?: string;
  completedAt?: string;
  createdAt: string;
}

export interface ReportSummaryDto {
  id: string;
  type: string;
  title: string;
  status: ReportStatus;
  sourceCount: number;
  entityCount: number;
  totalSizeMb: number;
  downloadUrl?: string;
  expiresAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface ReportDetailDto {
  id: string;
  type: string;
  title: string;
  status: ReportStatus;
  sourceCount: number;
  entityCount: number;
  totalSizeMb: number;
  downloadUrl?: string;
  expiresAt?: string;
  completedAt?: string;
  createdAt: string;
  contentMarkdown?: string;
  contentHtml?: string;
  updatedAt: string;
}

export interface ReportListResponse {
  data: ReportSummaryDto[];
  total: number;
  page: number;
  pageSize: number;
}

// --- List Params ---

export interface ReportListParams {
  page?: number;
  pageSize?: number;
  type?: ReportType;
  status?: ReportStatus;
}

// --- Report Type Metadata (for UI gallery) ---

export interface ReportTypeInfo {
  type: ReportType;
  label: string;
  description: string;
  icon: string;
}

export const REPORT_TYPES: ReportTypeInfo[] = [
  {
    type: 'executive_summary',
    label: 'Executive Summary',
    description: 'High-level overview of your knowledge base with key findings and insights',
    icon: 'FileText',
  },
  {
    type: 'entity_map',
    label: 'Entity Map',
    description: 'Visual map of all entities and their relationships across sources',
    icon: 'Network',
  },
  {
    type: 'source_digest',
    label: 'Source Digest',
    description: 'Comprehensive digest summarizing all ingested sources',
    icon: 'BookOpen',
  },
  {
    type: 'insights_report',
    label: 'Insights Report',
    description: 'Detailed report of decisions, action items, and findings',
    icon: 'Lightbulb',
  },
  {
    type: 'glossary_reference',
    label: 'Glossary Reference',
    description: 'Formatted glossary of all terms with definitions and context',
    icon: 'BookA',
  },
  {
    type: 'knowledge_timeline',
    label: 'Knowledge Timeline',
    description: 'Chronological timeline of knowledge evolution in your workspace',
    icon: 'Clock',
  },
];
