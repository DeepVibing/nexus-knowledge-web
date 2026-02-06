/**
 * Export Types for Nexus Knowledge
 */

export type ExportFormat = 'json' | 'csv' | 'markdown' | 'pdf';
export type ExportStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface ExportJobDto {
  id: string;
  format: ExportFormat;
  status: ExportStatus;
  downloadUrl: string | null;
  expiresAt: string | null;
  sourcesExported: number;
  entitiesExported: number;
  insightsExported: number;
  totalSizeMb: number;
  createdAt: string;
  completedAt: string | null;
}

export interface CreateExportRequest {
  format: ExportFormat;
  includeContent?: boolean;
  includeCitations?: boolean;
  includeEntities?: boolean;
  includeInsights?: boolean;
  sourceIds?: string[];
  dateStart?: string;
  dateEnd?: string;
}

export interface ExportListParams {
  page?: number;
  pageSize?: number;
}
