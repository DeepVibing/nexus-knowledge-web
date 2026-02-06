# Nexus Knowledge Web - TODO

## Completed (Feb 2026)

- [x] Phase 1: Project Foundation
  - [x] Initialize Vite project with React 19 + TypeScript
  - [x] Install dependencies (axios, tanstack-query, react-router, etc.)
  - [x] Configure Tailwind CSS 4
  - [x] Create directory structure

- [x] Phase 2-3: Types & Services
  - [x] Create TypeScript types (workspace, source, chat, entity, search, auth)
  - [x] Create query key factory
  - [x] Create API services (auth, workspaces, sources, chat, entities, search)

- [x] Phase 4-5: Hooks & Contexts
  - [x] Create TanStack Query hooks for all services
  - [x] Create AuthContext with token refresh
  - [x] Create ToastContext
  - [x] Create ThemeContext
  - [x] Create WorkspaceContext

- [x] Phase 6-7: UI Components & Pages
  - [x] Common components (Button, Input, Modal, Card, Badge, Spinner, EmptyState, Toast)
  - [x] Layout components (AppLayout, Sidebar, Header)
  - [x] Chat components (FabricChat, ChatInput, MessageBubble, CitationPopover, ConversationList)
  - [x] Sources components (SourceCard, UploadSourceModal)
  - [x] Entities components (EntityCard, EntityBrowser)
  - [x] Pages (Login, Register, WorkspaceList, ChatPage, SourcesPage, EntitiesPage, SettingsPage, NotFound)
  - [x] App routing with lazy loading

- [x] Authentication Flow
  - [x] Updated auth service to use `/api/v1/kb/auth/*` endpoints
  - [x] Registration page with password validation
  - [x] Login page with dev account helper
  - [x] Token refresh mechanism
  - [x] Session persistence with localStorage
  - [x] `/me` endpoint integration for session verification
  - [x] Fixed WorkspaceList context error (removed WorkspaceContext dependency)
  - [x] Configured .env for correct API base URL (https://localhost:7272)

## Next Steps (Priority Order)

1. **Glossary Page** - Implement glossary view (terms are entities with type='term')
2. **Insights Page** - Implement insights board for decisions/action items
3. **Entity Detail Modal** - Show full entity with relationships and mentions
4. **Source Detail Page** - View source content and processing status
5. **Export Wizard** - Export workspace data to JSON/Markdown/Obsidian
6. **Integration Connectors UI** - Connect Slack, Notion, Obsidian, etc.
7. **Real-time Updates** - Add WebSocket support for processing status

## Technical Debt

- [ ] Add unit tests with Vitest
- [ ] Add E2E tests with Playwright
- [ ] Improve error handling with error boundaries
- [ ] Add loading skeletons for better UX
- [ ] Implement search debouncing
- [ ] Add keyboard shortcuts

## Auth API Endpoints

| Method | Route                      | Auth Required |
|--------|----------------------------|---------------|
| POST   | /api/v1/kb/auth/register   | No            |
| POST   | /api/v1/kb/auth/login      | No            |
| POST   | /api/v1/kb/auth/refresh    | No            |
| GET    | /api/v1/kb/auth/me         | Yes           |
| POST   | /api/v1/kb/auth/logout     | Yes           |

**Dev Account:** dev@deepvibe.local / Dev123!

## Notes

- All TypeScript errors resolved
- Build completes successfully
- Following patterns from nexus-frontend-web sibling project
