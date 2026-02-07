/**
 * Source Types for Nexus Knowledge
 */

export type SourceType =
  | 'document'
  | 'meeting'
  | 'slack_channel'
  | 'notion_page'
  | 'asana_project'
  | 'web_page'
  | 'video'
  | 'cms_content'
  | 'obsidian_vault'
  | 'manual_entry'
  | 'image';

export type SourceStatus =
  | 'pending'
  | 'processing'
  | 'analyzing'
  | 'ready'
  | 'failed'
  | 'stale';

export interface SourceDto {
  id: string;
  workspaceId: string;
  name: string;
  sourceType: SourceType;
  status: SourceStatus;
  origin: SourceOrigin;
  processing?: SourceProcessing;
  metadata?: SourceMetadata;
  extractedEntities?: SourceEntityRef[];
  tags?: string[];
  lastSyncedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SourceOrigin {
  // For uploads
  uploadedFileName?: string;
  contentType?: string;
  fileSize?: number;
  checksum?: string;
  // For integrations
  connector?: string;
  externalId?: string;
  externalUrl?: string;
  syncConfig?: SyncConfig;
  // For URLs
  url?: string;
}

export interface SyncConfig {
  schedule: 'hourly' | 'daily' | 'weekly' | 'manual';
  syncMode: 'full' | 'incremental';
  historyDays?: number;
}

export interface SourceProcessing {
  chunksCount: number;
  tokensCount: number;
  pagesCount?: number;
  messagesCount?: number;
  durationMs?: number;
  processingDurationMs?: number;
  embeddingModel?: string;
}

export interface SourceMetadata {
  title?: string;
  author?: string;
  dateCreated?: string;
  language?: string;
  [key: string]: unknown;
}

export interface SourceEntityRef {
  entityId: string;
  name: string;
  type: string;
}

export interface AddSourceUrlRequest {
  url: string;
  name?: string;
  crawlDepth?: number;
  includePaths?: string[];
  excludePaths?: string[];
  tags?: string[];
}

export interface AddSourceConnectRequest {
  connectorId: string;
  externalId: string;
  name?: string;
  syncConfig?: Partial<SyncConfig>;
}

export interface SyncSourceRequest {
  fullSync?: boolean;
}

export interface SourceProcessingJobDto {
  jobId: string;
  sourceId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  currentStep?: string;
  steps: ProcessingStep[];
  error?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface ProcessingStep {
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  durationMs?: number;
}

export interface SourceListParams {
  page?: number;
  pageSize?: number;
  status?: SourceStatus;
  sourceType?: SourceType;
  search?: string;
  tags?: string[];
}

export interface SourceListResponse {
  data: SourceDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// --- Visual Intelligence Types ---

export interface DetectedEntityDto {
  name: string;
  type: string;
  description?: string;
  confidence: number;
}

export interface ImageMetadataDto {
  width?: number;
  height?: number;
  format?: string;
  detectedLanguages?: string[];
  tags?: string[];
}

export interface VisualAnalysisResponseDto {
  status: string;
  extractedText?: string;
  caption?: string;
  detailedDescription?: string;
  entities?: DetectedEntityDto[];
  metadata?: ImageMetadataDto;
  error?: string;
}
