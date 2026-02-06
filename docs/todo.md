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

## Next Up
1. Entity Detail Modal - expanded entity view with relationships
4. Source Detail Page - document viewer with chunk preview
5. Export Wizard - export knowledge base data
6. Integration Connectors UI - Slack, Notion, Obsidian connection panels
7. Real-time WebSocket updates - live processing status, new messages
