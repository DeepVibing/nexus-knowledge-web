/**
 * Knowledge Base Tool - Frontend Types
 *
 * TypeScript definitions following Project Studio patterns.
 * Reference: src/types/projectStudio.ts
 */

// =============================================================================
// CORE TYPES
// =============================================================================

export type WorkspaceVisibility = 'private' | 'team' | 'public';

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
  | 'manual_entry';

export type SourceStatus =
  | 'pending'
  | 'processing'
  | 'ready'
  | 'failed'
  | 'stale';

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

export type InsightType =
  | 'decision'
  | 'action_item'
  | 'key_finding'
  | 'question'
  | 'note';

export type InsightStatus = 'open' | 'resolved' | 'deferred';

export type WorkspaceMemberRole = 'owner' | 'admin' | 'editor' | 'viewer';

export type ExportFormat = 'json' | 'markdown' | 'obsidian' | 'notion';

export type SearchMode = 'semantic' | 'keyword' | 'hybrid';

export type CitationMode = 'inline' | 'footnotes' | 'none';

export type ResponseFormat = 'concise' | 'detailed' | 'bullets';

// =============================================================================
// WORKSPACE
// =============================================================================

export interface WorkspaceDto {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  visibility: WorkspaceVisibility;
  sourcesCount: number;
  membersCount: number;
  lastActivityAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceDetailDto extends WorkspaceDto {
  settings: WorkspaceSettings;
  stats: WorkspaceStats;
  members: WorkspaceMemberDto[];
}

export interface WorkspaceSettings {
  defaultEmbeddingModel?: string;
  defaultLlmModel?: string;
  autoExtractEntities: boolean;
  retentionDays?: number;
}

export interface WorkspaceStats {
  sourcesCount: number;
  chunksCount: number;
  entitiesCount: number;
  conversationsCount: number;
  insightsCount: number;
}

export interface WorkspaceMemberDto {
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: WorkspaceMemberRole;
  joinedAt: string;
}

export interface CreateWorkspaceRequest {
  name: string;
  description?: string;
  icon?: string;
  visibility?: WorkspaceVisibility;
}

export interface UpdateWorkspaceRequest {
  name?: string;
  description?: string;
  icon?: string;
  visibility?: WorkspaceVisibility;
  settings?: Partial<WorkspaceSettings>;
}

// =============================================================================
// SOURCES (following Project Studio KnowledgeSource pattern)
// =============================================================================

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
  type: EntityType;
}

// Source Requests
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

// Processing Job
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

// =============================================================================
// FABRIC CHAT (following Project Studio Ask pattern)
// =============================================================================

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

export interface DateRange {
  start: string;
  end: string;
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
  type: EntityType;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  retrievedChunks: number;
}

// Conversations
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

// =============================================================================
// SEARCH
// =============================================================================

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
  entityType?: EntityType;
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

// =============================================================================
// ENTITIES (following Project Studio Entity Registry pattern)
// =============================================================================

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

// Entity Requests
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
  entities?: EntitySummary[];
  completedAt?: string;
}

export interface MergeEntitiesRequest {
  sourceEntityId: string;
  targetEntityId: string;
  mergeAliases?: boolean;
  mergeRelationships?: boolean;
  mergeMentions?: boolean;
}

export interface ListEntitiesParams {
  entityType?: EntityType;
  search?: string;
  tags?: string[];
  relatedTo?: string;
  mentionedIn?: string;
  page?: number;
  pageSize?: number;
}

// =============================================================================
// GLOSSARY (built on Entity with type='term')
// =============================================================================

export interface GlossaryTermDto {
  id: string;
  term: string;
  definition: string;
  aliases?: string[];
  category?: string;
  relatedTerms?: string[];
  sourceReferences?: string[];
  usageCount: number;
  createdAt: string;
  updatedAt: string;
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
}

export interface ListGlossaryParams {
  search?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}

export interface GlossaryListResponse {
  data: GlossaryTermDto[];
  total: number;
  categories: string[];
}

// =============================================================================
// INSIGHTS (following Project Studio Decisions pattern)
// =============================================================================

export interface InsightDto {
  id: string;
  workspaceId: string;
  type: InsightType;
  title: string;
  content: string;
  status?: InsightStatus;
  assignee?: string;
  dueDate?: string;
  sourceIds: string[];
  conversationId?: string;
  linkedEntities?: string[];
  tags?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInsightRequest {
  type: InsightType;
  title: string;
  content: string;
  status?: InsightStatus;
  assignee?: string;
  dueDate?: string;
  sourceIds?: string[];
  conversationId?: string;
  linkedEntities?: string[];
  tags?: string[];
}

export interface UpdateInsightRequest {
  title?: string;
  content?: string;
  status?: InsightStatus;
  assignee?: string;
  dueDate?: string;
  linkedEntities?: string[];
  tags?: string[];
}

export interface CaptureInsightFromConversationRequest {
  type: InsightType;
  messageIds: string[];
  title?: string;
  tags?: string[];
}

export interface ListInsightsParams {
  type?: InsightType;
  status?: InsightStatus;
  assignee?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface InsightsListResponse {
  data: InsightDto[];
  total: number;
  stats: {
    open: number;
    resolved: number;
    deferred: number;
  };
}

// =============================================================================
// EXPORT
// =============================================================================

export interface ExportRequest {
  format: ExportFormat;
  options?: ExportOptions;
}

export interface ExportOptions {
  includeContent?: boolean;
  includeCitations?: boolean;
  includeEntities?: boolean;
  includeInsights?: boolean;
  sourceIds?: string[];
  dateRange?: DateRange;
}

export interface ExportJobDto {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  format: ExportFormat;
  downloadUrl?: string;
  expiresAt?: string;
  stats?: ExportStats;
  completedAt?: string;
}

export interface ExportStats {
  sourcesExported: number;
  entitiesExported: number;
  insightsExported: number;
  totalSizeMb: number;
}

// =============================================================================
// CONNECTORS
// =============================================================================

export interface ConnectorDto {
  id: string;
  name: string;
  description: string;
  icon: string;
  authType: 'oauth' | 'api_key' | 'local';
  capabilities: ConnectorCapability[];
  syncModes: ('full' | 'incremental')[];
  status: 'available' | 'coming_soon' | 'deprecated';
}

export type ConnectorCapability = 'read' | 'write' | 'sync' | 'webhook' | 'search';

export interface ConnectedIntegrationDto {
  id: string;
  connectorId: string;
  name: string;
  status: 'connected' | 'expired' | 'error';
  lastSyncAt?: string;
  sourcesCount: number;
  authExpiresAt?: string;
  createdAt: string;
}

export interface ConnectorResourceDto {
  externalId: string;
  name: string;
  type: string;
  description?: string;
  membersCount?: number;
  isConnected: boolean;
}

export interface ConnectOAuthRequest {
  authCode: string;
  redirectUri: string;
}

export interface ConnectApiKeyRequest {
  apiKey: string;
}

// =============================================================================
// WORKSPACE SHARING
// =============================================================================

export interface InviteMemberRequest {
  email: string;
  role: WorkspaceMemberRole;
}

export interface UpdateMemberRoleRequest {
  role: WorkspaceMemberRole;
}

// =============================================================================
// COMMON RESPONSE WRAPPERS
// =============================================================================

export interface PagedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface JobResponse {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  queuePosition?: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: {
    field: string;
    message: string;
  }[];
}

// =============================================================================
// QUERY KEYS (for TanStack Query)
// =============================================================================

export const knowledgeBaseKeys = {
  all: ['knowledge-base'] as const,

  workspaces: {
    all: () => [...knowledgeBaseKeys.all, 'workspaces'] as const,
    detail: (id: string) => [...knowledgeBaseKeys.workspaces.all(), id] as const,
  },

  sources: {
    all: (workspaceId: string) => [...knowledgeBaseKeys.all, 'sources', workspaceId] as const,
    detail: (workspaceId: string, sourceId: string) =>
      [...knowledgeBaseKeys.sources.all(workspaceId), sourceId] as const,
    job: (workspaceId: string, jobId: string) =>
      [...knowledgeBaseKeys.sources.all(workspaceId), 'jobs', jobId] as const,
  },

  conversations: {
    all: (workspaceId: string) => [...knowledgeBaseKeys.all, 'conversations', workspaceId] as const,
    detail: (workspaceId: string, conversationId: string) =>
      [...knowledgeBaseKeys.conversations.all(workspaceId), conversationId] as const,
  },

  entities: {
    all: (workspaceId: string) => [...knowledgeBaseKeys.all, 'entities', workspaceId] as const,
    detail: (workspaceId: string, entityId: string) =>
      [...knowledgeBaseKeys.entities.all(workspaceId), entityId] as const,
  },

  glossary: {
    all: (workspaceId: string) => [...knowledgeBaseKeys.all, 'glossary', workspaceId] as const,
    detail: (workspaceId: string, termId: string) =>
      [...knowledgeBaseKeys.glossary.all(workspaceId), termId] as const,
  },

  insights: {
    all: (workspaceId: string) => [...knowledgeBaseKeys.all, 'insights', workspaceId] as const,
    detail: (workspaceId: string, insightId: string) =>
      [...knowledgeBaseKeys.insights.all(workspaceId), insightId] as const,
  },

  search: {
    results: (workspaceId: string, query: string) =>
      [...knowledgeBaseKeys.all, 'search', workspaceId, query] as const,
  },

  connectors: {
    available: () => [...knowledgeBaseKeys.all, 'connectors', 'available'] as const,
    connected: (workspaceId: string) =>
      [...knowledgeBaseKeys.all, 'connectors', 'connected', workspaceId] as const,
    resources: (workspaceId: string, connectionId: string) =>
      [...knowledgeBaseKeys.all, 'connectors', 'resources', workspaceId, connectionId] as const,
  },

  export: {
    jobs: (workspaceId: string) => [...knowledgeBaseKeys.all, 'export', 'jobs', workspaceId] as const,
    job: (workspaceId: string, jobId: string) =>
      [...knowledgeBaseKeys.export.jobs(workspaceId), jobId] as const,
  },
};
