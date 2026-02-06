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
│   ├── common/      # Button, Card, Input, Modal, Badge, Spinner, EmptyState, Toast
│   ├── layout/      # AppLayout, Sidebar, Header
│   ├── chat/        # FabricChat, MessageBubble, ChatInput, CitationPopover, ConversationList
│   ├── sources/     # SourceCard, UploadSourceModal
│   ├── entities/    # EntityCard, EntityBrowser
│   ├── glossary/    # GlossaryTermCard, CreateTermModal
│   └── insights/    # InsightCard, InsightStatsBar, CreateInsightModal
├── contexts/        # AuthContext, ToastContext, ThemeContext, WorkspaceContext
├── hooks/           # useChat, useSources, useEntities, useWorkspaces, useGlossary, useInsights, useExports, useConnectors
├── services/        # chat.ts, sources.ts, entities.ts, workspaces.ts, glossary.ts, insights.ts, exports.ts, connectors.ts
├── pages/           # Lazy-loaded route pages (10 pages)
├── config/          # constants.ts, routes
├── lib/             # api-client.ts, react-query.ts, utils.ts
└── types/           # index.ts (all TypeScript types + kbKeys) + domain files
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
