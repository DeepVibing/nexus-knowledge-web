# Nexus Knowledge Web - Architecture & Design Decisions

## Design System: "The Vault" (Concept A)

**Selected:** Feb 2026 — Based on DeepVibe brand extraction + knowledge vault thematic elements.

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| vault-black | `#0A0A0A` | Page backgrounds |
| vault-surface | `#141414` | Cards, inputs, modals |
| vault-elevated | `#1C1C1C` | Elevated surfaces, tabs |
| vault-border | `#2A2A2A` | Default borders |
| vault-border-active | `#3A3A3A` | Hover borders |
| magenta | `#E80ADE` | Primary accent, CTAs, active states |
| magenta-hover | `#D000CC` | Hover state for magenta |
| magenta-glow | `rgba(232,10,222,0.15)` | Glow effects |
| magenta-subtle | `rgba(232,10,222,0.08)` | Subtle backgrounds |
| text | `#F5F5F5` | Primary text |
| text-secondary | `#A0A0A0` | Secondary text |
| text-muted | `#666666` | Muted/placeholder text |

### Typography
- **Headings:** Oswald — `tracking-[0.1em-0.15em] uppercase`
- **Body:** Lexend — clean, readable sans-serif
- **Data/Code:** JetBrains Mono — metadata, citations, file sizes, timestamps

### Key Design Patterns
- **Structured borders:** `rounded-sm` everywhere (no rounded-lg/xl)
- **Magenta left border:** Active states in sidebar nav + assistant chat messages (3px)
- **Status top-border strips:** SourceCard status indicators (2px colored top border)
- **Slash dividers:** "/" in magenta as section separators (inherited from deepvibe.com)
- **Section headers:** Oswald uppercase with wide tracking for sidebar groups
- **Card hover:** `hover:border-[#E80ADE] hover:shadow-[0_0_15px_rgba(232,10,222,0.08)]`

## Architecture Decisions

### State Management
- **Server state:** TanStack Query with `kbKeys` factory for cache key consistency
- **App state:** React Context (Auth, Toast, Theme, Workspace)
- **Form state:** React Hook Form + Zod validation
- **No client-side global store** — server state is the source of truth

### API Integration
- Axios client with interceptors (401 → clear tokens + redirect)
- LLM operations use 180s timeout
- All hooks use `kbKeys` factory: `kbKeys.sources.list(workspaceId, params)`

### Error Handling Pattern
- Service methods: catch → toast → return boolean (success/failure)
- Modals: only close on success, stay open on failure for retry
- No re-throwing errors from catch blocks (causes unhandled rejections)

### Routing
- React Router 7 with lazy-loaded pages
- Workspace-scoped routes: `/workspace/:workspaceId/chat|sources|entities|settings`
- Auth routes: `/login`, `/register`
- Protected by AuthContext session check

### Component Organization
```
src/
├── components/
│   ├── common/          # Button, Card, Input, Modal, Badge, Spinner, EmptyState, Toast
│   ├── layout/          # AppLayout, Sidebar, Header
│   ├── chat/            # FabricChat, MessageBubble, ChatInput, CitationPopover, ConversationList
│   ├── sources/         # SourceCard, UploadSourceModal, ImageSourceDetail (Phase 5)
│   ├── entities/        # EntityCard, EntityBrowser
│   ├── glossary/        # GlossaryTermCard, CreateTermModal
│   ├── insights/        # InsightCard, InsightStatsBar, CreateInsightModal
│   ├── knowledge-graph/ # GraphViewer, NodeDetailPanel, GraphFilters, GraphSearch (Phase 6)
│   └── reports/         # ReportCard, GenerateReportModal, ReportPreview, InfographicPreview (Phase 7)
├── contexts/            # AuthContext, ToastContext, ThemeContext, WorkspaceContext
├── hooks/               # useChat, useSources, useEntities, useWorkspaces, useGlossary, useInsights,
│                        # useExports, useConnectors, useKnowledgeGraph (Phase 6), useReports (Phase 7)
├── services/            # chat.ts, sources.ts, entities.ts, workspaces.ts, glossary.ts, insights.ts,
│                        # exports.ts, connectors.ts, knowledgeGraph.ts (Phase 6), reports.ts (Phase 7)
├── pages/               # Lazy-loaded route pages (12+ pages)
│                        # KnowledgeGraphPage (Phase 6), ReportsPage (Phase 7)
├── config/              # constants.ts, routes
├── lib/                 # api-client.ts, react-query.ts, utils.ts
└── types/               # index.ts (all TypeScript types + kbKeys) + domain files
│                        # knowledgeGraph.ts (Phase 6), report.ts (Phase 7)
```

### Domain Layer Pattern (Phase 3-4)
Each new domain follows the same 3-layer pattern:
1. **Types** (`src/types/{domain}.ts`) — DTOs, request/response types, union types for statuses
2. **Service** (`src/services/{domain}.ts`) — `apiClient.getRaw/postRaw/putRaw/deleteRaw` calls, default export
3. **Hooks** (`src/hooks/use{Domain}.ts`) — TanStack Query `useQuery`/`useMutation`, invalidation via `kbKeys`

Query key entries in `kbKeys` follow workspace-scoped nesting:
```ts
kbKeys.glossary.list(workspaceId, params)
kbKeys.insights.stats(workspaceId)
kbKeys.exports.job(workspaceId, jobId)
kbKeys.connectors.available() // system-level, no workspace
```

### Glossary Page Design
- Alphabetical grouping with letter headers (Oswald font, magenta accent)
- Category filter dropdown (populated from API `/glossary/categories`)
- GlossaryTermCard: term (bold), definition (line-clamp-2), category badge, aliases as tags, usage count in mono
- Create/Edit modal: term, definition, category (select or new), aliases (comma-separated)

### Insights Page Design
- Stats bar (Open/Resolved/Deferred counts) — clickable to filter by status
- Type filter dropdown (Decision, Action Item, Finding, Question)
- InsightCard: type badge (color-coded), status via colored left border, assignee, due date, tags
- Color coding: decisions=info/magenta, action_items=warning/amber, findings=success/green, questions=default/gray

---

## Phase 5-7 Architecture (Planned)

### Knowledge Graph Page Design (Phase 6)

**Adapted from:** `nexus-frontend-web/src/pages/GraphExplorer.tsx` (948 lines)

**Layout:** Full-screen D3 force-directed graph with side panels
```
┌─────────────────────────────────────────────────────────────┐
│  [Filters]          D3 Graph Canvas              [Search]   │
│  ┌─────────┐  ┌─────────────────────────────┐  ┌─────────┐ │
│  │ Entity  │  │                             │  │ Node    │ │
│  │ Type    │  │    ●──────●                 │  │ Detail  │ │
│  │ Toggles │  │   /        \                │  │ Panel   │ │
│  │         │  │  ●    ●─────●               │  │         │ │
│  │ Commu-  │  │       |                     │  │ Search  │ │
│  │ nities  │  │       ●                     │  │ Results │ │
│  │         │  │                             │  │         │ │
│  │ Top     │  │                             │  │ Path    │ │
│  │ Nodes   │  │                             │  │ Finder  │ │
│  └─────────┘  └─────────────────────────────┘  └─────────┘ │
│  [Zoom +/-] [Fit] [Fullscreen]                              │
└─────────────────────────────────────────────────────────────┘
```

**D3 Force Simulation Config:**
```javascript
d3.forceSimulation(nodes)
  .force('link', d3.forceLink().distance(120).strength(0.4))
  .force('charge', d3.forceManyBody().strength(-400).distanceMax(500))
  .force('center', d3.forceCenter(width/2, height/2))
  .force('collision', d3.forceCollide().radius(50))
```

**Entity Type Colors (Vault-adapted):**
```
person:   #6366f1 (Indigo)     company:  #f59e0b (Amber)
project:  #10b981 (Emerald)    tool:     #0ea5e9 (Sky)
concept:  #8b5cf6 (Purple)     event:    #14b8a6 (Teal)
location: #ec4899 (Pink)       document: #f97316 (Orange)
term:     #a855f7 (Purple)
```

**Node sizing:** `radius = 10 + degreeCentrality * 20`
**Selected state:** `stroke: #E80ADE` (magenta, Vault accent)
**Edge width:** `1 + weight * 2`
**Labels:** Truncated to 25 chars, Lexend font

**Interactions:**
- Drag nodes to reposition (D3 drag behavior)
- Zoom/pan (D3 zoom, extent [0.1, 8x])
- Click node → open detail panel with relationships, mentions, sources
- Hover node → highlight connected edges
- Filter by entity type (sidebar toggles)
- Search nodes → highlight + center on result

**Dependencies:** `d3` (v7), `@types/d3`

### Reports Page Design (Phase 7)

**Layout:** Report type gallery + generation history
```
┌─────────────────────────────────────────────────────────────┐
│  Reports                                    [Generate New]  │
│                                                             │
│  ┌─── Report Types ────────────────────────────────────┐   │
│  │ [Executive Summary] [Entity Map] [Source Digest]     │   │
│  │ [Insights Report]  [Glossary]   [Timeline]           │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  Generated Reports                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │ Thumb    │  │ Thumb    │  │ Thumb    │                 │
│  │ Title    │  │ Title    │  │ Title    │                 │
│  │ Date     │  │ Date     │  │ Date     │                 │
│  │ [Download]│  │ [Download]│  │ [Download]│                │
│  └──────────┘  └──────────┘  └──────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

**Generate Report Modal:**
- Report type selector (6 types)
- Visual mode: Standard / Creative (Nano Banana Pro) / Illustrated (Recraft V3)
- Source filter (optional)
- Date range filter (optional)
- Entity type filter (optional)
- Format: PDF / PNG
- Generate button → job polling with progress indicator

**Report Card:**
- Thumbnail preview (generated during rendering)
- Title, report type badge, date, file size
- Download button + delete button
- Expiry indicator (7-day TTL)

### Visual Intelligence Integration (Phase 5)

**Image Upload Flow:**
```
UploadSourceModal → detects image content type → shows image preview
                  → upload as multipart/form-data → backend routes to vision pipeline
                  → SourceCard shows image thumbnail + "analyzing" status
                  → Vision analysis extracts: OCR text, entities, description
                  → Entities flow into knowledge graph
                  → Image becomes searchable via RAG (extracted text is chunked + embedded)
```

**SourceCard Image Variant:**
- Thumbnail (64x64) replaces type icon
- "Image" source type badge
- Analysis status indicator (analyzing → ready)
- Click → ImageSourceDetail: full image + extracted text + entities panel

### Provider Architecture

```
Frontend (React)
    │
    ▼
API Layer (.NET)
    │
    ├── GeminiLlmService (existing)
    │   ├── Chat/RAG (gemini-2.5-flash)
    │   ├── Entity Extraction (gemini-2.5-flash)
    │   └── Visual Intelligence (gemini-2.5-flash + image parts) ← Phase 5
    │
    ├── FalAIService (planned)
    │   ├── Nano Banana Pro (infographic generation) ← Phase 7
    │   ├── Recraft V3 (SVG illustrations) ← Phase 7
    │   └── FLUX.2 Pro (hero images) ← Phase 7
    │
    ├── WhisperService (planned)
    │   └── gpt-4o-mini-transcribe (audio transcription) ← Phase 8
    │
    └── PuppeteerService (planned)
        └── HTML → PDF/PNG rendering ← Phase 7
```
