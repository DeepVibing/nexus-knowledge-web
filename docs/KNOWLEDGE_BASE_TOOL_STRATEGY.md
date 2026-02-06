# Knowledge Base Tool Strategy

**Version:** 1.0
**Date:** February 4, 2026
**Status:** Planning

---

## Executive Summary

Build a NotebookLM-style knowledge base tool that serves as a **Context Engine** - centralizing organizational knowledge, enabling dynamic queries via chat, and providing immediate context for AI workflows. This tool follows the architectural patterns established in Project Studio's Knowledge Fabric, adapted for organization-wide knowledge management.

### Core Value Proposition

> "Reduce friction in managing sprawling knowledge bases by providing a single source of truth with chat-based dynamic queries."

---

## Requirements Analysis

### Extracted from Stakeholder Conversation

| Requirement | Priority | Category |
|-------------|----------|----------|
| Centralized client info, projects, vendors, tasks | P0 | Core |
| Chat with source documents (dynamic queries) | P0 | Core |
| Shared access for multiple stakeholders | P0 | Collaboration |
| Integration with Obsidian, Asana, Vimeo, Slack, Fireflies, Notion | P1 | Integrations |
| Wiki-style structured knowledge base | P1 | Organization |
| Export/migration capabilities (avoid vendor lock-in) | P1 | Data Portability |
| Glossary of terms and tools | P2 | Discovery |
| Support for onboarding and consistency | P2 | UX |
| Context engine for AI workflows (Claude DSL) | P0 | AI Integration |
| Up-to-date product vision, technical details, positioning | P1 | Content Types |

### User Personas

1. **Knowledge Curator** (Michael) - Maintains and updates knowledge base, imports sources
2. **Knowledge Consumer** (Team members) - Queries knowledge, extracts insights for work
3. **AI Workflow User** (Bert) - Uses knowledge context for LLM interactions
4. **External Collaborator** (Gonzo) - Read/limited write access to specific workspaces

---

## Architecture Overview

### Mapping to Project Studio Knowledge Fabric

| Project Studio Concept | Knowledge Base Equivalent |
|------------------------|---------------------------|
| Project | Workspace |
| Knowledge Sources | Sources |
| Entity Registry | Knowledge Entities |
| Ask/Chat | Fabric Chat |
| Decisions | Insights & Decisions |
| Reports | Knowledge Reports |
| Context Rail | Context Sidebar |

### System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           KNOWLEDGE BASE TOOL                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Sources    │  │    Fabric    │  │   Entities   │  │   Insights   │    │
│  │   Manager    │  │     Chat     │  │    Graph     │  │    Panel     │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │
│         │                 │                 │                 │             │
│  ┌──────┴─────────────────┴─────────────────┴─────────────────┴──────┐     │
│  │                      Unified API Layer                             │     │
│  └──────┬─────────────────┬─────────────────┬─────────────────┬──────┘     │
│         │                 │                 │                 │             │
│  ┌──────┴───────┐  ┌──────┴───────┐  ┌──────┴───────┐  ┌──────┴───────┐    │
│  │   Document   │  │     RAG      │  │  Knowledge   │  │    Export    │    │
│  │   Pipeline   │  │    Engine    │  │    Graph     │  │    Engine    │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                      Integration Connectors                           │   │
│  │  Obsidian │ Asana │ Slack │ Fireflies │ Notion │ Vimeo │ Webflow     │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Data Model

### Core Entities

```typescript
// Workspace - Top-level container (like a Project in Project Studio)
interface Workspace {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  visibility: 'private' | 'team' | 'public';
  members: WorkspaceMember[];
  settings: WorkspaceSettings;
  createdAt: string;
  updatedAt: string;
}

// Source - Any ingested content
interface Source {
  id: string;
  workspaceId: string;
  name: string;
  sourceType: SourceType;
  status: 'pending' | 'processing' | 'ready' | 'failed' | 'stale';

  // Origin tracking
  origin: SourceOrigin;

  // Processing metadata
  chunksCount?: number;
  tokensCount?: number;
  lastSyncedAt?: string;
  processingJobId?: string;

  // Content metadata
  contentType?: string;
  language?: string;
  dateRange?: { start: string; end: string };

  createdAt: string;
  updatedAt: string;
}

type SourceType =
  | 'document'        // PDF, DOCX, TXT, MD
  | 'meeting'         // Fireflies transcripts
  | 'slack_channel'   // Slack integration
  | 'notion_page'     // Notion pages/databases
  | 'asana_project'   // Asana projects/tasks
  | 'web_page'        // Scraped web content
  | 'video'           // Vimeo/YouTube transcripts
  | 'cms_content'     // Webflow CMS
  | 'obsidian_vault'  // Obsidian markdown files
  | 'manual_entry';   // User-created content

interface SourceOrigin {
  connector?: string;         // Integration connector ID
  externalId?: string;        // ID in source system
  externalUrl?: string;       // Link to source
  syncConfig?: SyncConfig;    // Auto-sync settings
}

// Knowledge Entity - Extracted structured data
interface KnowledgeEntity {
  id: string;
  workspaceId: string;
  entityType: EntityType;
  name: string;
  aliases?: string[];
  description?: string;

  // Structured attributes by type
  attributes: Record<string, unknown>;

  // Relationships to other entities
  relationships: EntityRelationship[];

  // Source references
  mentions: EntityMention[];

  // User annotations
  notes?: string;
  tags?: string[];

  createdAt: string;
  updatedAt: string;
}

type EntityType =
  | 'person'
  | 'company'
  | 'project'
  | 'tool'
  | 'concept'
  | 'event'
  | 'location'
  | 'document'
  | 'term';       // Glossary term

interface EntityRelationship {
  targetEntityId: string;
  relationshipType: string;  // 'works_at', 'owns', 'related_to', etc.
  strength?: number;
  sourceId?: string;         // Source where relationship was found
}

interface EntityMention {
  sourceId: string;
  chunkId: string;
  position: { start: number; end: number };
  context: string;           // Surrounding text
  confidence: number;
}

// Conversation - Chat session
interface Conversation {
  id: string;
  workspaceId: string;
  title?: string;
  messages: ConversationMessage[];
  sourcesUsed: string[];     // Source IDs referenced
  entitiesDiscussed: string[]; // Entity IDs mentioned
  createdAt: string;
  updatedAt: string;
}

interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  entityReferences?: string[];
  thinking?: string;         // Reasoning trace
  createdAt: string;
}

interface Citation {
  sourceId: string;
  sourceName: string;
  chunkId: string;
  text: string;
  relevanceScore: number;
  pageNumber?: number;
  timestamp?: string;        // For video/audio
}

// Insight - Captured decision or insight
interface Insight {
  id: string;
  workspaceId: string;
  conversationId?: string;   // If from chat
  sourceIds: string[];

  type: 'decision' | 'action_item' | 'key_finding' | 'question' | 'note';
  title: string;
  content: string;

  status?: 'open' | 'resolved' | 'deferred';
  assignee?: string;
  dueDate?: string;

  tags?: string[];
  linkedEntities?: string[];

  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
```

### Vector Storage Schema

```typescript
// Chunk - Processed content segment
interface Chunk {
  id: string;
  sourceId: string;
  workspaceId: string;

  // Content
  content: string;
  contentHash: string;

  // Position
  position: number;
  pageNumber?: number;
  timestamp?: { start: number; end: number };

  // Metadata for filtering
  metadata: {
    sourceType: SourceType;
    sourceName: string;
    dateCreated?: string;
    author?: string;
    section?: string;
    [key: string]: unknown;
  };

  // Embedding (stored in vector DB)
  embedding?: number[];
  embeddingModel?: string;
}
```

---

## API Design

### Following Project Studio Pattern

```typescript
// =============================================================================
// WORKSPACES
// =============================================================================

// GET /api/v1/workspaces
// List user's workspaces

// POST /api/v1/workspaces
// Create workspace

// GET /api/v1/workspaces/{id}
// Get workspace details

// =============================================================================
// SOURCES (mirrors Project Studio Knowledge Sources)
// =============================================================================

// GET /api/v1/workspaces/{id}/sources
// List sources with status, stats

// POST /api/v1/workspaces/{id}/sources
// Add new source (upload or connect)
interface AddSourceRequest {
  sourceType: SourceType;
  name?: string;

  // For uploads
  file?: File;
  url?: string;

  // For integrations
  connectorId?: string;
  externalId?: string;
  syncConfig?: SyncConfig;
}

// POST /api/v1/workspaces/{id}/sources/{sourceId}/sync
// Trigger re-sync for integration source

// DELETE /api/v1/workspaces/{id}/sources/{sourceId}
// Remove source and its chunks

// =============================================================================
// FABRIC CHAT (mirrors Project Studio Ask)
// =============================================================================

// POST /api/v1/workspaces/{id}/ask
// Ask a question with RAG
interface AskRequest {
  question: string;
  conversationId?: string;   // Continue existing conversation

  // Source filtering
  sourceIds?: string[];      // Limit to specific sources
  sourceTypes?: SourceType[];
  dateRange?: { start: string; end: string };

  // Response options
  includeThinking?: boolean;
  citationMode?: 'inline' | 'footnotes' | 'none';
  responseFormat?: 'concise' | 'detailed' | 'bullets';
}

interface AskResponse {
  answer: string;
  citations: Citation[];
  thinking?: string;
  relatedEntities?: KnowledgeEntity[];
  suggestedFollowUps?: string[];
  conversationId: string;
}

// GET /api/v1/workspaces/{id}/conversations
// List conversations

// GET /api/v1/workspaces/{id}/conversations/{conversationId}
// Get full conversation with messages

// =============================================================================
// KNOWLEDGE ENTITIES
// =============================================================================

// GET /api/v1/workspaces/{id}/entities
// List entities with filtering
interface ListEntitiesRequest {
  entityType?: EntityType;
  search?: string;
  tags?: string[];
  relatedTo?: string;        // Entity ID
  mentionedIn?: string;      // Source ID
}

// GET /api/v1/workspaces/{id}/entities/{entityId}
// Get entity with relationships and mentions

// POST /api/v1/workspaces/{id}/entities
// Create manual entity

// PATCH /api/v1/workspaces/{id}/entities/{entityId}
// Update entity (add notes, tags, etc.)

// POST /api/v1/workspaces/{id}/entities/extract
// Trigger entity extraction from sources
interface ExtractEntitiesRequest {
  sourceIds?: string[];      // Specific sources, or all if empty
  entityTypes?: EntityType[];
  mergeExisting?: boolean;   // Merge with existing entities
}

// =============================================================================
// INSIGHTS & DECISIONS
// =============================================================================

// GET /api/v1/workspaces/{id}/insights
// List insights with filtering

// POST /api/v1/workspaces/{id}/insights
// Create insight (manual or from conversation)

// PATCH /api/v1/workspaces/{id}/insights/{insightId}
// Update insight status, assignee, etc.

// =============================================================================
// EXPORT (Data Portability)
// =============================================================================

// POST /api/v1/workspaces/{id}/export
// Export workspace data
interface ExportRequest {
  format: 'json' | 'markdown' | 'obsidian' | 'notion';
  includeContent?: boolean;      // Include full source content
  includeCitations?: boolean;    // Include chat history with citations
  includeEntities?: boolean;     // Include entity graph
  includeInsights?: boolean;     // Include captured insights
}

interface ExportResponse {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  expiresAt?: string;
}

// =============================================================================
// SEARCH (Cross-source semantic search)
// =============================================================================

// POST /api/v1/workspaces/{id}/search
// Semantic search across sources
interface SearchRequest {
  query: string;
  limit?: number;
  offset?: number;

  // Filtering
  sourceIds?: string[];
  sourceTypes?: SourceType[];
  entityTypes?: EntityType[];
  dateRange?: { start: string; end: string };

  // Search mode
  mode?: 'semantic' | 'keyword' | 'hybrid';
}

interface SearchResponse {
  results: SearchResult[];
  totalCount: number;
  facets?: {
    sourceTypes: { type: string; count: number }[];
    dateRanges: { range: string; count: number }[];
  };
}

interface SearchResult {
  type: 'chunk' | 'entity' | 'insight';
  id: string;
  score: number;

  // For chunks
  sourceId?: string;
  sourceName?: string;
  content?: string;

  // For entities
  entityType?: EntityType;
  name?: string;

  // Highlights
  highlights?: string[];
}

// =============================================================================
// GLOSSARY (Built on Entities)
// =============================================================================

// GET /api/v1/workspaces/{id}/glossary
// Get glossary terms (entities of type 'term')

// POST /api/v1/workspaces/{id}/glossary
// Add glossary term
interface AddGlossaryTermRequest {
  term: string;
  definition: string;
  aliases?: string[];
  category?: string;
  relatedTerms?: string[];
  sourceReferences?: string[];
}
```

---

## RAG Pipeline

### Document Processing

```
Source Upload/Connect
        │
        ▼
┌───────────────────┐
│  Document Parser  │  ← PDF, DOCX, MD, HTML, etc.
│  (per source type)│
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│    Text Extract   │  ← Clean text extraction
│    & Cleaning     │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│   Chunking with   │  ← Semantic chunking
│   Overlap         │     ~500 tokens, 100 overlap
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│    Embedding      │  ← text-embedding-3-small (1536-dim)
│    Generation     │     or local: embeddinggemma (512-dim)
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│   Vector Store    │  ← PostgreSQL + pgvector
│   (pgvector)      │     or Qdrant for scale
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Entity Extraction │  ← Async agent extracts entities
│     (Agent)       │
└───────────────────┘
```

### Retrieval & Generation

```
User Question
      │
      ▼
┌─────────────────┐
│ Query Analysis  │  ← Understand intent, extract filters
│    (LLM)        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Hybrid Search   │  ← Combine semantic + keyword
│ Vector + BM25   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Reranking     │  ← Cross-encoder rerank top candidates
│  (Optional)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Context Assembly│  ← Build context from top chunks
│ + Source Meta   │     Include source names, dates
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Generation    │  ← Generate answer with citations
│   (Claude)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Citation Attach │  ← Map citations to source locations
│ & Formatting    │
└─────────────────┘
```

### Context Assembly Strategy

```typescript
// Maximum context tokens per query
const MAX_CONTEXT_TOKENS = 8000;

// Context assembly priority
// 1. Most relevant chunks (by score)
// 2. Recency boost for time-sensitive queries
// 3. Source diversity (don't over-represent one source)
// 4. Entity context (if entities mentioned)

interface ContextAssemblyConfig {
  maxChunks: number;               // 15-20 chunks
  minRelevanceScore: number;       // 0.7 threshold
  recencyBoostDays?: number;       // Boost recent content
  maxChunksPerSource?: number;     // Prevent single-source dominance
  includeEntityContext?: boolean;  // Add entity descriptions
}
```

---

## Agent Workflows

### Entity Extraction Agent

```typescript
// Triggered after source processing
interface EntityExtractionAgentConfig {
  sourceIds: string[];
  entityTypes: EntityType[];
  mergeThreshold: number;      // Similarity for merging
  confidenceThreshold: number; // Min confidence to create
}

// Agent workflow:
// 1. Chunk through source content
// 2. Extract entities per chunk via LLM
// 3. Deduplicate and merge similar entities
// 4. Establish relationships between entities
// 5. Calculate confidence scores
// 6. Persist to entity graph
```

### Knowledge Synthesis Agent

```typescript
// Triggered on-demand for reports
interface KnowledgeSynthesisAgentConfig {
  sourceIds: string[];
  topic: string;
  reportType: 'summary' | 'timeline' | 'comparison' | 'deep_dive';
  maxLength?: number;
}

// Agent workflow:
// 1. Retrieve all relevant chunks for topic
// 2. Build knowledge map of key points
// 3. Identify gaps and contradictions
// 4. Generate structured report
// 5. Add citations and source links
```

### Auto-Sync Agent

```typescript
// Background agent for integration sync
interface AutoSyncAgentConfig {
  workspaceId: string;
  connectorId: string;
  schedule: 'hourly' | 'daily' | 'weekly';
  fullSync: boolean;           // Full vs incremental
}

// Agent workflow:
// 1. Check last sync timestamp
// 2. Fetch new/updated content from integration
// 3. Process and chunk new content
// 4. Update/remove stale content
// 5. Trigger entity re-extraction if needed
// 6. Update sync status
```

---

## Integration Connectors

### Connector Architecture

```typescript
interface Connector {
  id: string;
  name: string;
  type: ConnectorType;
  icon: string;

  // Auth
  authType: 'oauth' | 'api_key' | 'token';
  authConfig?: Record<string, unknown>;

  // Capabilities
  capabilities: ConnectorCapability[];

  // Sync
  supportedSyncModes: ('full' | 'incremental')[];
  defaultSyncSchedule?: string;
}

type ConnectorType =
  | 'obsidian'
  | 'asana'
  | 'slack'
  | 'fireflies'
  | 'notion'
  | 'vimeo'
  | 'webflow'
  | 'google_drive'
  | 'github';

type ConnectorCapability =
  | 'read'
  | 'write'
  | 'sync'
  | 'webhook'
  | 'search';
```

### Priority Connectors

| Connector | Priority | Auth | Sync Mode | Notes |
|-----------|----------|------|-----------|-------|
| **Obsidian** | P0 | Local files | Full | Markdown vault import |
| **Fireflies** | P0 | API Key | Incremental | Meeting transcripts |
| **Notion** | P1 | OAuth | Incremental | Pages & databases |
| **Slack** | P1 | OAuth | Incremental | Channel history |
| **Asana** | P1 | OAuth | Incremental | Projects & tasks |
| **Google Drive** | P1 | OAuth | Incremental | Docs, sheets |
| **Vimeo** | P2 | OAuth | Full | Video transcripts |
| **Webflow** | P2 | API Key | Full | CMS content |

---

## Frontend Architecture

### Component Hierarchy

```
KnowledgeBaseApp
├── WorkspaceSelector
│   ├── WorkspaceList
│   └── CreateWorkspaceModal
│
├── KnowledgeBaseShell (main layout)
│   ├── Sidebar
│   │   ├── SourcesList
│   │   ├── EntitiesBrowser
│   │   └── InsightsList
│   │
│   ├── MainPanel
│   │   ├── FabricChat (default)
│   │   │   ├── ConversationHistory
│   │   │   ├── MessageThread
│   │   │   ├── CitationPanel
│   │   │   └── FollowUpSuggestions
│   │   │
│   │   ├── SourcesManager
│   │   │   ├── SourceUpload
│   │   │   ├── IntegrationConnect
│   │   │   └── SourceDetails
│   │   │
│   │   ├── EntityGraph
│   │   │   ├── GraphVisualization
│   │   │   └── EntityDetails
│   │   │
│   │   ├── GlossaryView
│   │   │   ├── TermsList
│   │   │   └── TermEditor
│   │   │
│   │   └── InsightsBoard
│   │       ├── InsightCards
│   │       └── ActionItems
│   │
│   └── ContextRail (right sidebar)
│       ├── ActiveSources
│       ├── RecentEntities
│       └── QuickActions
│
└── ExportWizard
```

### Key UI Patterns

```typescript
// Following Project Studio patterns

// 1. Source Card (like KnowledgeFabric SourceCard)
interface SourceCardProps {
  source: Source;
  onSync: () => void;
  onRemove: () => void;
  onViewDetails: () => void;
}

// 2. Chat Interface (like Project Studio Ask)
interface FabricChatProps {
  workspaceId: string;
  conversationId?: string;
  onCitationClick: (citation: Citation) => void;
  onEntityClick: (entityId: string) => void;
}

// 3. Citation Popover (like Fabric citations)
interface CitationPopoverProps {
  citation: Citation;
  onNavigateToSource: () => void;
}

// 4. Entity Card (like Entity Registry)
interface EntityCardProps {
  entity: KnowledgeEntity;
  showRelationships?: boolean;
  showMentions?: boolean;
  onEdit: () => void;
}
```

---

## Implementation Phases

### Phase 1: Foundation (3-4 weeks)

**Goals:** Core infrastructure, basic chat functionality

**Deliverables:**
- [ ] Workspace CRUD
- [ ] Document upload & processing pipeline
- [ ] Basic chunking and embedding
- [ ] Vector storage (pgvector)
- [ ] Simple RAG chat
- [ ] Citation tracking

**Components:**
- `WorkspaceService`
- `DocumentProcessor`
- `EmbeddingService`
- `VectorStore`
- `ChatService`

### Phase 2: Enhanced Chat (2-3 weeks)

**Goals:** Rich chat experience with citations

**Deliverables:**
- [ ] Conversation persistence
- [ ] Source filtering in queries
- [ ] Citation UI with navigation
- [ ] Follow-up suggestions
- [ ] Search across sources

**Components:**
- `FabricChat.tsx`
- `ConversationPanel.tsx`
- `CitationPopover.tsx`
- `SearchModal.tsx`

### Phase 3: Entity System (2-3 weeks)

**Goals:** Knowledge graph with extracted entities

**Deliverables:**
- [ ] Entity extraction agent
- [ ] Entity CRUD
- [ ] Relationship mapping
- [ ] Entity browser UI
- [ ] Glossary view

**Components:**
- `EntityExtractionAgent`
- `EntityService`
- `EntityBrowser.tsx`
- `GlossaryView.tsx`

### Phase 4: Integrations (3-4 weeks)

**Goals:** Connect external sources

**Deliverables:**
- [ ] Connector framework
- [ ] Obsidian connector (P0)
- [ ] Fireflies connector (P0)
- [ ] Notion connector (P1)
- [ ] Slack connector (P1)
- [ ] Auto-sync scheduling

**Components:**
- `ConnectorFramework`
- `ObsidianConnector`
- `FirefliesConnector`
- `NotionConnector`
- `SlackConnector`

### Phase 5: Collaboration & Export (2 weeks)

**Goals:** Team features, data portability

**Deliverables:**
- [ ] Workspace sharing
- [ ] Access control
- [ ] Export to JSON/Markdown
- [ ] Export to Obsidian format
- [ ] Import from existing sources

**Components:**
- `WorkspaceSharing.tsx`
- `ExportWizard.tsx`
- `ImportWizard.tsx`

### Phase 6: Insights & Reports (2 weeks)

**Goals:** Capture and synthesize knowledge

**Deliverables:**
- [ ] Insight capture from chat
- [ ] Action item tracking
- [ ] Knowledge synthesis agent
- [ ] Report generation

**Components:**
- `InsightsPanel.tsx`
- `KnowledgeSynthesisAgent`
- `ReportGenerator`

---

## Technical Stack

### Backend

| Layer | Technology | Notes |
|-------|------------|-------|
| API | .NET 9 / ASP.NET Core | Consistent with Nexus |
| Database | PostgreSQL + pgvector | Vector storage |
| Queue | Redis / Hangfire | Job processing |
| Vector DB | pgvector (or Qdrant) | Scalable option |
| Embedding | OpenAI / Ollama | text-embedding-3-small |
| LLM | Claude API / Ollama | Chat & extraction |

### Frontend

| Layer | Technology | Notes |
|-------|------------|-------|
| Framework | React 19 + TypeScript | Consistent with Nexus |
| State | TanStack Query | Server state |
| Routing | React Router 7 | SPA routing |
| Styling | Tailwind CSS 4 | Consistent design |
| Icons | Lucide React | Icon library |

### Infrastructure

| Service | Provider | Notes |
|---------|----------|-------|
| Hosting | GCP Cloud Run | Scalable containers |
| Storage | GCS / Backblaze | Document storage |
| CDN | Cloudflare | Static assets |
| Monitoring | Sentry | Error tracking |

---

## Success Metrics

### Adoption

- Active workspaces created
- Sources ingested (by type)
- Daily active users querying

### Engagement

- Questions asked per user
- Conversation depth (follow-ups)
- Citations clicked
- Insights captured

### Quality

- Answer relevance (user feedback)
- Citation accuracy
- Entity extraction precision
- Sync success rate

### Efficiency

- Time to first answer
- Sources processing time
- Query latency (p95 < 3s)

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| LLM hallucination | High | Strong citation grounding, confidence scores |
| Data quality | Medium | Source validation, chunk quality checks |
| Integration stability | Medium | Retry logic, fallback to cached data |
| Scale/cost | Medium | Chunking optimization, caching layer |
| Vendor lock-in | Medium | Export capabilities, standard formats |

---

## Appendix: Comparison with NotebookLM

| Feature | NotebookLM | Our Tool |
|---------|------------|----------|
| Source types | PDF, text, web | +Integrations (Slack, Notion, etc.) |
| Chat | ✅ | ✅ with filters |
| Citations | ✅ | ✅ with navigation |
| Audio summaries | ✅ | ❌ (future) |
| Entity extraction | ❌ | ✅ |
| Knowledge graph | ❌ | ✅ |
| Glossary | ❌ | ✅ |
| Team sharing | Limited | ✅ |
| Export | ❌ | ✅ (multi-format) |
| API access | ❌ | ✅ (context for AI workflows) |
| Self-hosted option | ❌ | ✅ (future) |

---

**Document Owner:** Bert Nieves
**Last Updated:** February 4, 2026
**Next Review:** February 18, 2026
