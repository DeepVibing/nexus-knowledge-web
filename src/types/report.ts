/**
 * Report Types for Nexus Knowledge
 * Aligned to swagger v3 API schemas
 */

export type ReportType =
  | 'Summary'
  | 'EntityMap'
  | 'Timeline'
  | 'Comparison'
  | 'Infographic';

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
  imageModel?: string;
  imageStyle?: string;
  imageWidth?: number;
  imageHeight?: number;
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
    type: 'Summary',
    label: 'Executive Summary',
    description: 'High-level overview of your knowledge base with key findings and insights',
    icon: 'FileText',
  },
  {
    type: 'EntityMap',
    label: 'Entity Map',
    description: 'Visual map of all entities and their relationships across sources',
    icon: 'Network',
  },
  {
    type: 'Timeline',
    label: 'Timeline',
    description: 'Chronological narrative of knowledge evolution in your workspace',
    icon: 'Clock',
  },
  {
    type: 'Comparison',
    label: 'Comparison',
    description: 'Cross-source comparison report (requires 2+ selected sources)',
    icon: 'GitCompareArrows',
  },
  {
    type: 'Infographic',
    label: 'Infographic',
    description: 'AI-generated visual infographic summarizing key data and insights',
    icon: 'Image',
  },
];

// --- Image Generation Models (for infographic reports) ---

export interface ImageModelInfo {
  id: string;
  label: string;
  description: string;
}

export const IMAGE_MODELS: ImageModelInfo[] = [
  {
    id: 'fal-ai/nano-banana-pro',
    label: 'Nano Banana Pro',
    description: 'Fast generation, balanced quality ($0.15/img)',
  },
  {
    id: 'fal-ai/recraft-v3',
    label: 'Recraft V3',
    description: 'SVG-capable, precise layouts ($0.04/img)',
  },
  {
    id: 'fal-ai/flux/dev',
    label: 'FLUX.2',
    description: 'High fidelity photorealistic output ($0.05/img)',
  },
];
