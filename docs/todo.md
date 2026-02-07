# Nexus Knowledge Web - TODO

## Completed
- [x] Project scaffolding (React 19 + Vite 7 + TS 5.9 + Tailwind 4)
- [x] Auth flow (Login, Register, token refresh, session management)
- [x] Workspace CRUD (list, create, update, delete, members)
- [x] Chat with RAG (FabricChat, conversations, citations, streaming placeholder)
- [x] Sources management (upload, URL add, list, card display, sync, delete)
- [x] Entity browser + cards (type filtering, search)
- [x] 8 pages with lazy loading (Login, Register, WorkspaceList, Chat, Sources, Entities, Settings, 404)
- [x] TanStack Query hooks for all domains (kbKeys factory)
- [x] Theme/Toast/Auth/Workspace contexts
- [x] Fix: Source upload error handling (boolean return pattern, modal stays open on failure)
- [x] **Vault Reskin (Concept A)** - Complete UI rebrand to DeepVibe "The Vault" aesthetic
  - CSS foundation (Google Fonts, CSS variables, scrollbar, utilities)
  - Common components (Button, Card, Input, Modal, Badge, Spinner, EmptyState, Toast)
  - Layout components (AppLayout, Sidebar, Header)
  - Chat components (FabricChat, MessageBubble, ChatInput, CitationPopover, ConversationList)
  - Source/Entity components (SourceCard, EntityCard, EntityBrowser, UploadSourceModal)
  - All pages (Login, Register, WorkspaceList, SourcesPage, SettingsPage, NotFound)
  - Build verified: 0 errors, ~160KB gzipped
- [x] **Phase 3 & 4 Frontend Integration** - Backend APIs for Glossary, Insights, Export, Connectors
  - Types: glossary.ts, insight.ts, export.ts, connector.ts + kbKeys entries
  - Services: glossaryApi, insightsApi, exportsApi, connectorsApi
  - Hooks: useGlossary (6 hooks), useInsights (7 hooks), useExports (4 hooks), useConnectors (7 hooks)
  - Glossary Page: GlossaryTermCard, CreateTermModal, alphabetical grouping, category filter
  - Insights Page: InsightCard, InsightStatsBar, CreateInsightModal, type/status filtering
  - Routes updated: /glossary → GlossaryPage, /insights → InsightsPage (were placeholders)
  - Build verified: 0 errors, ~172KB gzipped
- [x] **Loading Indicators & Error Handling Audit** - All mutation actions now show spinners + disabled state
  - EntityBrowser: Extract Entities button shows isLoading via extractEntities.isPending
  - SourceCard: Sync/Delete buttons show Loader2 spinner via pendingId tracking at page level
  - GlossaryTermCard: Delete button shows spinner via deletingTermId at page level
  - InsightCard: Delete button shows spinner via deletingInsightId at page level
  - Pattern: page tracks pendingId state → set before mutation → clear in finally → pass boolean to card
- [x] **Strategy Update v2.0** - Multimodal intelligence, knowledge graph, reports/infographics
  - Updated KNOWLEDGE_BASE_TOOL_STRATEGY.md with visual/audio/video intelligence strategy
  - Updated KNOWLEDGE_BASE_API_REQUIREMENTS.md with 3 new API sections (11-13)
  - Updated architectureDesign.md with Phase 5-7 component architecture
  - Added visual-intelligence-provider-assessment.md (Gemini + fal.ai evaluation)
- [x] **Phase 5-7a Frontend Integration** - Visual Intelligence, Knowledge Graph, Reports
  - **Phase 5 (Visual Intelligence):**
    - Extended SourceType with 'image', SourceStatus with 'analyzing'
    - Added DetectedEntityDto, ImageMetadataDto, VisualAnalysisResponseDto to source.ts
    - Added analyze/getAnalysis methods to sourcesApi service
    - Added useAnalyzeSource/useSourceAnalysis hooks
    - Added image MIME types to FILE_UPLOAD config
    - SourceCard handles 'analyzing' status variant
  - **Phase 6 (Knowledge Graph):**
    - Types: knowledgeGraph.ts (14 types + ENTITY_TYPE_COLORS + params interfaces)
    - Service: knowledgeGraph.ts (7 endpoints: getGraph, getNeighbors, findPaths, getCommunities, detectCommunities, search, getInfluential)
    - Hooks: useKnowledgeGraph.ts (7 hooks: useGraphData, useNodeNeighbors, useFindPaths, useCommunities, useDetectCommunities, useGraphSearch, useInfluentialEntities)
    - KnowledgeGraphPage: Full D3 force-directed graph with entity type filter sidebar, node detail panel, zoom controls, search with results overlay, influential nodes ranking, graph stats
    - D3 v7 installed (d3 + @types/d3)
    - Route: /workspaces/:workspaceId/graph
    - Sidebar: Share2 icon "Graph" nav item
  - **Phase 7a (Reports):**
    - Types: report.ts (10 types + REPORT_TYPES metadata array)
    - Service: reports.ts (5 endpoints: create, list, getJobStatus, get, delete)
    - Hooks: useReports.ts (5 hooks: useReports, useReport, useGenerateReport, useReportJobStatus, useDeleteReport)
    - ReportsPage: Report type gallery (6 types), generation history grid, GenerateReportModal (type selector + title + focus topic), ReportCard (status badges, download, delete, expiry), active job progress indicator with auto-polling
    - Route: /workspaces/:workspaceId/reports
    - Sidebar: FileBarChart icon "Reports" nav item
  - kbKeys factory updated with graph (6 keys) and reports (4 keys) entries
  - 12 pages with lazy loading, 36+ TanStack Query hooks total
  - Build verified: 0 errors, ~178KB gzipped
- [x] **Phase 7b + Phase 8 Frontend Integration** - Infographics & Audio Intelligence
  - **Phase 7b (Infographics via fal.ai):**
    - Added 'infographic' to ReportType union
    - Extended ReportOptionsDto with imageModel, imageStyle, imageWidth, imageHeight
    - Added IMAGE_MODELS metadata array (Nano Banana Pro, Recraft V3, FLUX.2)
    - Added infographic entry to REPORT_TYPES gallery
    - ReportsPage: Image icon for infographic type, visual settings panel in GenerateReportModal (model selector, style prompt) shown when infographic selected
    - Gallery grid updated to 7-column layout for new type
  - **Phase 8 (Audio Intelligence):**
    - Added 'audio' to SourceType, 'transcribing' to SourceStatus
    - Added TranscribeAudioRequestDto, AudioTranscriptionResponseDto, AudioTranscriptResponseDto, TranscriptChunkDto types
    - Added transcribe/getTranscript methods to sourcesApi service
    - Added useTranscribeSource/useSourceTranscript hooks
    - Added ACCEPTED_AUDIO_TYPES (13 MIME types) and MAX_AUDIO_SIZE (100MB) to FILE_UPLOAD config
    - SourceCard: Headphones icon for audio, Image icon for image, 'transcribing' status strip
  - 12 pages with lazy loading, 40+ TanStack Query hooks total
  - Build verified: 0 errors, ~180KB gzipped

---

## Phase 5 Remaining: Visual Intelligence UI Polish

**Frontend (remaining):**
- [ ] Extend UploadSourceModal to accept image files (preview, drag-drop)
- [ ] SourceCard image variant (thumbnail replacing type icon, "Image" badge)
- [ ] ImageSourceDetail component (full image + extracted text + entities panel)
- [ ] Analysis progress indicator (analyzing → ready status transition)

---

## Phase 6 Remaining: Knowledge Graph Enhancements

**Frontend (remaining):**
- [ ] Community coloring on graph nodes
- [ ] Path finder between entities (two-entity selector + highlight path)
- [ ] Community detection trigger button + community list panel
- [ ] Highlight connected edges on node hover (done in D3, needs refinement)
- [ ] Node double-click → navigate to entity detail

---

## Phase 7 Remaining: Reports Enhancements

**Frontend (remaining):**
- [ ] Report preview/viewer (render contentHtml in modal)
- [ ] Source/entity/date range filters in GenerateReportModal
- [ ] Report thumbnail previews on cards

---

## Phase 8 Remaining: Audio Intelligence UI Polish

**Frontend (remaining):**
- [ ] Extend UploadSourceModal to accept audio files (preview, drag-drop)
- [ ] Audio player component (embedded in source detail)
- [ ] Transcript view with speaker labels and timestamps
- [ ] Timestamp-linked citations (click citation → jump to audio position)

---

## Phase 9: UI Polish & Remaining Features

- [ ] Entity Detail Modal — expanded entity view with relationships mini-graph
- [ ] Source Detail Page — document viewer with chunk preview
- [ ] Export Wizard UI — multi-format export (JSON, Markdown, Obsidian, Notion)
- [ ] Integration Connectors UI — Slack, Notion, Obsidian connection panels
- [ ] Real-time WebSocket updates — live processing status, new messages
- [ ] Cross-workspace search
