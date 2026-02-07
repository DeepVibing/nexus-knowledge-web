# Knowledge Base Tool Strategy

**Version:** 2.0
**Date:** February 6, 2026
**Status:** Active Development (Phases 1-4 Frontend Complete)

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
  | 'image'           // PNG, JPG, WEBP, GIF, BMP — processed via Gemini Vision
  | 'audio'           // MP3, WAV, M4A, OGG, FLAC — transcribed via Whisper
  | 'meeting'         // Fireflies transcripts
  | 'slack_channel'   // Slack integration
  | 'notion_page'     // Notion pages/databases
  | 'asana_project'   // Asana projects/tasks
  | 'web_page'        // Scraped web content
  | 'video'           // Vimeo/YouTube transcripts (audio track extraction)
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

## Multimodal Intelligence Strategy

### Overview

Nexus Knowledge evolves beyond text-only document ingestion to support **image, audio, and video** sources. This aligns with industry direction (NotebookLM added images, audio, and YouTube video as source types in 2025) while leveraging our existing Gemini API infrastructure.

See `docs/visual-intelligence-provider-assessment.md` for detailed model evaluation.

### Visual Intelligence (Image Sources)

**Provider:** Gemini 2.5 Flash (current API — zero new dependencies)
**Cost:** ~$0.0011/image | **Accuracy:** 98.5% OCR printed, 94% handwritten

**Supported Formats:** PNG, JPG, WEBP, GIF (static), BMP
**Max Size:** 20MB per image

**What Gets Extracted:**
- **OCR text** — screenshots, whiteboards, handwritten notes, scanned documents
- **Entities** — people roles, companies, products, locations from photos
- **Chart/diagram interpretation** — data extraction from graphs, flowcharts, architecture diagrams
- **Style DNA** — brand colors, typography, layout patterns from design assets
- **Document structure** — tables, forms, invoices → structured data

**Pipeline:**
```
Image Upload → Gemini Vision Analysis → Extracted Text + Entities + Metadata
                                        ↓
                        Chunking → Embedding → Vector Store (same as text pipeline)
                                        ↓
                        Entity Extraction → Knowledge Graph
```

**Upgrade Path:** Gemini 3 Flash adds "Agentic Vision" (auto-zoom, auto-crop for 5-10% accuracy boost on fine-grained analysis). Natural upgrade when available.

### Audio Intelligence (Phase 8)

**Provider:** OpenAI `gpt-4o-mini-transcribe` ($0.006/min) + Pyannote 3.1 (diarization)
**Cost:** ~$0.36/hour of audio

**Supported Formats:** MP3, WAV, M4A, OGG, WEBM, FLAC, AAC
**Max Size:** 100MB per file

**What Gets Extracted:**
- Full transcript with speaker labels + timestamps
- Topic segmentation and extraction
- Named entities (people, companies, products mentioned)
- Action items and decisions
- Key quotes and highlights

**Pipeline:**
```
Audio Upload → Whisper Transcription → Speaker Diarization (Pyannote)
                                        ↓
                        Transcript + Speaker Labels + Timestamps
                                        ↓
                        Chunking → Embedding → Vector Store
                                        ↓
                        Entity Extraction → Knowledge Graph
                        Insight Extraction → Action Items
```

### Video Intelligence (Deferred — Phase 9+)

90% of video's knowledge value comes from the audio track. Strategy: extract audio → reuse audio pipeline, extract keyframes → reuse image pipeline. Defer native video analysis until demand warrants.

---

## Knowledge Graph Visualization

### Overview

Nexus Knowledge already extracts entities and relationships. The Knowledge Graph Viewer makes these visible and interactive — a **major differentiator** that no consumer-grade tool offers (only Glean at enterprise scale).

### Architecture (Adapted from nexus-frontend-web)

The sibling project `nexus-frontend-web` has a production-ready D3 force-directed graph viewer with full CRUD, search, community detection, and centrality analytics. We adapt this for the knowledge base context.

**Key Adaptation:** The sibling project uses project-scoped graphs with separate graph creation jobs. In Nexus Knowledge, the entity system IS the graph — entities are nodes, relationships are edges. We render the existing entity data as a graph rather than requiring a separate build step.

### Source Files to Adapt

| Sibling Project File | Lines | Adapt To |
|---------------------|-------|----------|
| `src/types/knowledgeGraph.ts` | 1637 | `src/types/knowledgeGraph.ts` — Slim down to entity-graph types |
| `src/services/knowledgeGraph.ts` | 1417 | `src/services/knowledgeGraph.ts` — Workspace-scoped graph endpoints |
| `src/hooks/useKnowledgeGraph.ts` | 1587 | `src/hooks/useKnowledgeGraph.ts` — Hooks for visualization + search |
| `src/pages/GraphExplorer.tsx` | 948 | `src/pages/KnowledgeGraphPage.tsx` — Full-screen D3 viewer |
| `src/components/knowledge-graph/GraphBuildProgress.tsx` | 350 | Adapt for entity extraction progress |

### D3 Visualization Features

- **Force-directed layout** with configurable forces (link distance, charge, collision)
- **Node sizing** by degree centrality (scaled 10 + centrality * 20)
- **Node coloring** by entity type (person=indigo, company=amber, project=emerald, etc.)
- **Directional edges** with width scaled by relationship weight
- **Interactive controls:** zoom/pan, drag nodes, fit-to-screen, fullscreen toggle
- **Selection:** Magenta stroke (#E80ADE) for selected nodes (Vault design system)
- **Filters:** Entity type toggles, relationship type filters, confidence threshold
- **Click-to-query:** Click a node → open detail panel with relationships, mentions, related sources
- **Search:** Find nodes by name, explore K-hop neighborhoods, find paths between entities

### Dependencies to Add

```bash
npm install d3 @types/d3
```

### Graph Data Model

Reuses existing `EntityDto` + `EntityRelationship` from the entity system:
```typescript
// Graph node = EntityDto with centrality metrics added
interface GraphNodeDto extends EntityDto {
  degreeCentrality: number;
  pageRank?: number;
  communityId?: string;
}

// Graph edge = EntityRelationship with visual metadata
interface GraphEdgeDto {
  id: string;
  sourceEntityId: string;
  targetEntityId: string;
  relationshipType: string;
  weight: number;
  confidence: number;
  sourceId?: string; // Which source this relationship was found in
}

// Visualization response (API returns this format)
interface KnowledgeGraphVisualizationDto {
  nodes: GraphNodeDto[];
  edges: GraphEdgeDto[];
  stats: {
    nodeCount: number;
    edgeCount: number;
    density: number;
    communities?: number;
  };
}
```

---

## Reports & Infographics Generation

### Overview

Transform knowledge base content into visual outputs: structured reports (PDF/PNG) and AI-generated infographics. Uses a **hybrid pipeline** — LLM structures content, templates render layout, AI generates decorative visuals.

### Provider Stack

| Layer | Provider | Model | Cost |
|-------|----------|-------|------|
| Content Analysis | Gemini | gemini-2.5-flash (existing) | ~$0.001/report |
| Infographic Images | fal.ai | Nano Banana Pro | $0.15/image |
| Illustration SVGs | fal.ai | Recraft V3 | $0.04/image |
| Hero Images | fal.ai | FLUX.2 Pro | $0.05/image |
| Template Rendering | Server-side | Puppeteer (HTML→PNG/PDF) | Free |

**Nano Banana Pro** is Google's state-of-the-art image generation model (Gemini 3 Image). Key strengths:
- 4K resolution output
- Accurate text rendering in multiple languages/fonts
- Excels at infographic-style compositions
- Already available on fal.ai at `fal-ai/nano-banana-pro`

### Report Types

| Report Type | Description | Template Style |
|-------------|-------------|----------------|
| **Executive Summary** | High-level workspace overview with key stats, top entities, recent insights | Single-page dashboard |
| **Entity Relationship Map** | Visual entity graph + relationship table + centrality rankings | Graph + data tables |
| **Source Digest** | Summarized highlights from all/selected sources with citations | Multi-section document |
| **Insights Report** | Decisions, action items, findings grouped by status/type | Kanban-style sections |
| **Glossary Reference** | All terms with definitions, aliases, usage stats | Alphabetical reference |
| **Knowledge Timeline** | Chronological view of source additions, entity discoveries, insights | Timeline infographic |

### Generation Pipeline

```
User Request (report type + options)
        │
        ▼
[Step 1: LLM Content Analysis]
  Gemini analyzes workspace content:
  - Extracts key facts, statistics, relationships
  - Selects most relevant entities/insights/sources
  - Outputs structured JSON: sections, hierarchy, chart data, key quotes
        │
        ▼
[Step 2: Layout Engine]
  Backend selects template based on report type:
  - Maps structured JSON data to template slots
  - Generates HTML/CSS using Vault design system tokens
  - Embeds charts (Chart.js or SVG) for data visualizations
        │
        ▼
[Step 3: Visual Enhancement (Optional)]
  If "creative mode" or infographic:
  - fal.ai Nano Banana Pro → full AI infographic image ($0.15)
  - fal.ai Recraft V3 → SVG icons/illustrations ($0.04 each)
  - fal.ai FLUX.2 → decorative hero images ($0.05 each)
        │
        ▼
[Step 4: Rendering]
  Puppeteer (server-side) converts HTML → PNG or PDF
  - Deterministic, pixel-perfect output
  - Branded with Vault design system (dark theme, magenta accents)
        │
        ▼
[Step 5: Storage & Delivery]
  Upload to cloud storage → return signed download URL
  - TTL: 7 days
  - Export history tracked per workspace
```

### API Integration

Reports/Infographics are long-running jobs (10-60s depending on AI visual generation). Uses the same job polling pattern as source processing and entity extraction.

---

## Updated Competitive Positioning

### NotebookLM Feature Comparison (Feb 2026)

| Feature | NotebookLM | Nexus Knowledge | Advantage |
|---------|------------|-----------------|-----------|
| **Source types** | PDF, DOCX, TXT, MD, images, 20+ audio formats, YouTube URLs, web URLs, Google ecosystem | PDF, DOCX, TXT, MD, **images** (planned), audio (planned) + **Slack, Notion, Obsidian, Fireflies connectors** | **Nexus** — broader integration ecosystem |
| **RAG Chat** | Gemini-powered, custom personas (10K chars) | Gemini-powered, source/date filtering, citation navigation | Parity |
| **Entity Extraction** | None (mind maps only) | Full entity system with types, relationships, mentions, merge | **Nexus** — unique differentiator |
| **Knowledge Graph** | Interactive mind maps (auto-generated) | **D3 force-directed graph** with entity relationships, centrality, search | **Nexus** — deeper graph capabilities |
| **Glossary** | None | Full glossary with categories, aliases, usage tracking | **Nexus** — unique |
| **Insights** | None | Decisions, action items, findings with status tracking | **Nexus** — unique |
| **Audio Overviews** | AI podcast generation (2-voice deep dives) | Not planned (not our differentiator) | **NotebookLM** |
| **Video Overviews** | AI-narrated video presentations (6 visual styles) | Not planned | **NotebookLM** |
| **Reports** | Slide decks, infographics (Nano Banana Pro) | **Reports + Infographics** (Nano Banana Pro via fal.ai, Recraft V3, FLUX.2) | Parity (different approach) |
| **Flashcards/Quizzes** | Auto-generated with difficulty levels | Not planned (educational focus, not our target) | **NotebookLM** |
| **Deep Research** | Autonomous web research agent | Not planned (we focus on curated internal knowledge) | **NotebookLM** |
| **Export** | Limited (images only, no bulk export) | **Multi-format** (JSON, Markdown, Obsidian, Notion) | **Nexus** — major differentiator |
| **API Access** | Enterprise only (alpha) | Full REST API, context engine for AI workflows | **Nexus** |
| **Team Collaboration** | Plus tier only, basic sharing | Workspace roles, member management | **Nexus** |
| **Self-hosted** | Never | Future option | **Nexus** |
| **Pricing** | Free–$250/mo | Self-hosted/custom | **Nexus** — no per-seat cloud lock-in |

### Our Blue Ocean

1. **Entity-centric knowledge graph** — No consumer tool visualizes extracted entity relationships interactively
2. **Integration connectors** — Slack, Notion, Obsidian, Fireflies bring in knowledge from where teams already work
3. **Export-first / anti-lock-in** — NotebookLM's biggest user complaint is lack of export
4. **Context Engine for AI workflows** — Workspace as a context provider for external AI tools (Claude DSL)
5. **Visual Intelligence → Entity Graph** — Images become searchable, entities from images flow into the knowledge graph

---

## Implementation Phases

### Phase 1: Foundation — COMPLETE
- [x] Workspace CRUD, document upload/processing, chunking, embedding, vector storage, RAG chat, citations

### Phase 2: Enhanced Chat — COMPLETE
- [x] Conversation persistence, source filtering, citation UI, follow-up suggestions, search

### Phase 3: Entity System — COMPLETE (Frontend)
- [x] Entity extraction trigger, entity CRUD, entity browser UI, glossary page

### Phase 4: Integrations & Insights — COMPLETE (Frontend)
- [x] Connector types/services/hooks, insights page with stats/filters, export infrastructure

### Phase 5: Visual Intelligence + Image Sources (HIGH PRIORITY)

**Goals:** Accept image uploads as knowledge sources, extract text/entities/metadata via Gemini vision

**Frontend Deliverables:**
- [ ] Image upload support in UploadSourceModal (accept PNG/JPG/WEBP/GIF/BMP)
- [ ] Image thumbnail preview on SourceCard
- [ ] Image detail view (full image + extracted text + entities)
- [ ] Visual indicator for image source type (camera icon)

**Backend API Requirements:**
- [ ] `POST /sources` — Accept image uploads (multipart/form-data, image/* content types)
- [ ] `POST /sources/{sourceId}/analyze` — Trigger visual analysis job
- [ ] Gemini Vision integration in source processing pipeline
- [ ] Store extracted text as chunks, extracted entities into entity system

**Components:**
- Extended `UploadSourceModal` — image preview, drag-drop for images
- Extended `SourceCard` — image thumbnail display
- `ImageSourceDetail` — full image viewer + extracted content panel
- Backend: `IVisualIntelligenceService` → `GeminiVisionService`

### Phase 6: Knowledge Graph Viewer (HIGH PRIORITY)

**Goals:** Interactive D3 force-directed graph visualization of entity relationships

**Frontend Deliverables:**
- [ ] `KnowledgeGraphPage.tsx` — Full-screen D3 graph (adapted from nexus-frontend-web GraphExplorer)
- [ ] Entity type filter panel (sidebar)
- [ ] Click-to-inspect node detail panel
- [ ] Search + find paths between entities
- [ ] Zoom/pan/drag/fit-to-screen controls
- [ ] Community detection visualization (colored clusters)

**Backend API Requirements:**
- [ ] `GET /workspaces/{id}/graph` — Visualization data (nodes + edges + stats)
- [ ] `GET /workspaces/{id}/graph/nodes/{nodeId}/neighbors` — K-hop traversal
- [ ] `GET /workspaces/{id}/graph/paths` — Find paths between entities
- [ ] `GET /workspaces/{id}/graph/communities` — Community clusters
- [ ] `POST /workspaces/{id}/graph/search` — GraphRAG search

**Dependencies:** `d3`, `@types/d3`

**Source:** Adapted from `nexus-frontend-web/src/pages/GraphExplorer.tsx` (948 lines) + types/services/hooks

### Phase 7: Reports & Infographics (HIGH PRIORITY)

**Goals:** Generate visual reports and AI infographics from workspace knowledge

**Frontend Deliverables:**
- [ ] `ReportsPage.tsx` — Report type selection + generation history
- [ ] `GenerateReportModal` — Type selection, options, source filters
- [ ] `ReportPreviewPanel` — Preview generated report before download
- [ ] Report generation progress indicator (job polling)
- [ ] Download as PDF/PNG
- [ ] Infographic mode toggle (uses AI image generation)

**Backend API Requirements:**
- [ ] `POST /workspaces/{id}/reports` — Create report generation job
- [ ] `GET /workspaces/{id}/reports/jobs/{jobId}` — Poll job status
- [ ] `GET /workspaces/{id}/reports` — List generated reports
- [ ] `GET /workspaces/{id}/reports/{reportId}` — Get report with download URL
- [ ] `DELETE /workspaces/{id}/reports/{reportId}` — Delete report
- [ ] Backend: LLM content analysis → HTML template → Puppeteer render → cloud storage
- [ ] Backend: fal.ai Nano Banana Pro / Recraft V3 / FLUX.2 for AI visuals

**Report Types:** Executive Summary, Entity Map, Source Digest, Insights Report, Glossary Reference, Knowledge Timeline

### Phase 8: Audio Intelligence

**Goals:** Accept audio uploads, transcribe, diarize, extract entities and insights

**Frontend Deliverables:**
- [ ] Audio upload support in UploadSourceModal (accept MP3/WAV/M4A/OGG/FLAC)
- [ ] Audio player component (embedded in source detail)
- [ ] Transcript view with speaker labels and timestamps
- [ ] Timestamp-linked citations (click citation → jump to audio position)

**Backend API Requirements:**
- [ ] Audio transcription service (OpenAI Whisper or gpt-4o-mini-transcribe)
- [ ] Speaker diarization (Pyannote 3.1)
- [ ] Transcript → chunking → embedding pipeline
- [ ] Entity/insight extraction from transcripts

### Phase 9: UI Polish & Remaining Features

**Goals:** Complete remaining frontend features from original roadmap

**Deliverables:**
- [ ] Entity Detail Modal — expanded entity view with relationships graph
- [ ] Source Detail Page — document viewer with chunk preview
- [ ] Export Wizard UI — multi-format export with options
- [ ] Integration Connectors UI — Slack, Notion, Obsidian connection panels
- [ ] Real-time WebSocket updates — live processing status, new messages
- [ ] Cross-workspace search

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

*Moved to "Updated Competitive Positioning" section above (more comprehensive table).*

## Appendix: Provider Cost Summary

| Capability | Provider | Model | Cost | Notes |
|-----------|----------|-------|------|-------|
| Text Embeddings | Gemini | gemini-embedding-001 (768d) | $0.025/1M tokens | Current |
| LLM/Chat/RAG | Gemini | gemini-2.5-flash | $0.30/$2.50 per 1M tokens | Current |
| Entity Extraction | Gemini | gemini-2.5-flash | $0.30/$2.50 per 1M tokens | Current |
| Vision/Image Analysis | Gemini | gemini-2.5-flash | ~$0.0011/image | Phase 5 |
| Infographic Generation | fal.ai | Nano Banana Pro | $0.15/image | Phase 7 |
| Illustration SVG | fal.ai | Recraft V3 | $0.04/image | Phase 7 |
| Hero Images | fal.ai | FLUX.2 Pro | $0.05/image | Phase 7 |
| Audio Transcription | OpenAI | gpt-4o-mini-transcribe | $0.006/min | Phase 8 |
| Speaker Diarization | Pyannote | pyannote-3.1 | Self-hosted | Phase 8 |

---

**Document Owner:** Bert Nieves
**Last Updated:** February 6, 2026
**Next Review:** February 20, 2026
