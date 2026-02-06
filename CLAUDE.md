# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **nexus-knowledge-web** - the React/TypeScript frontend for the Knowledge Base Tool within the Nexus ecosystem. It's a NotebookLM-style knowledge management application with RAG-powered chat, entity extraction, and multi-source integration capabilities.

**Status:** Planning/Initial Development (as of Feb 2026)

## Tech Stack

- **Framework:** React 19 + TypeScript 5.9+
- **Build:** Vite 7+
- **Styling:** Tailwind CSS 4+
- **State:** TanStack Query (server state), React Context (app state)
- **Routing:** React Router 7+
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React
- **API Client:** Axios

Follow patterns from the sibling project `nexus-frontend-web` for consistency.

## Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build (includes TypeScript check)
npm run build

# Lint
npm run lint

# Preview production build
npm run preview
```

## Architecture

### API Base URL
```
/api/v1/kb/workspaces/{workspaceId}/...
```

### Core Domain Models
- **Workspace** - Top-level container for knowledge bases
- **Source** - Ingested documents, integrations (Slack, Notion, Obsidian, etc.)
- **Conversation** - Chat sessions with RAG-powered Q&A
- **Citation** - Source references in chat responses
- **KnowledgeEntity** - Extracted entities (people, companies, projects, terms)
- **Insight** - Captured decisions, action items, findings

### Component Hierarchy
```
KnowledgeBaseApp
├── WorkspaceSelector
├── KnowledgeBaseShell (main layout)
│   ├── Sidebar (SourcesList, EntitiesBrowser, InsightsList)
│   ├── MainPanel
│   │   ├── FabricChat (default view)
│   │   ├── SourcesManager
│   │   ├── EntityGraph
│   │   ├── GlossaryView
│   │   └── InsightsBoard
│   └── ContextRail (right sidebar)
└── ExportWizard
```

## Key Guidelines

- You are ONLY responsible for React/TypeScript UI code, not API backend code
- DO NOT create .md files for every update - use core system files for tracking
- Never mock data - always integrate with real APIs or throw errors

## Definition of Done

A task is NOT complete until:
1. **Zero TypeScript errors** - `npm run build` must complete with 0 errors
2. **Code compiles cleanly** - No `@ts-ignore` or untyped `any` unless documented
3. **Pre-existing errors don't count** - Call them out if you can't fix them

## Bug Investigation Protocol

BEFORE writing any code fix:
1. **Does similar code work elsewhere?** Same pattern working elsewhere = bug is NOT in shared code
2. **Frontend or backend issue?** 4xx/5xx from API = likely backend
3. **State diagnosis FIRST** - Tell user the root cause before proposing changes
4. **If uncertain, ASK** - Request network tab, console logs, etc.

## Foundational Code (Do Not Modify Lightly)

These files affect the entire app - get approval before modifying:
- `src/lib/api-client.ts` - Core API client
- `src/lib/react-query.ts` - Query client config
- `src/contexts/*` - Global providers (Auth, Toast)
- `src/config/*` - App configuration
- Core hooks used across features

## Related Documentation

- `docs/KNOWLEDGE_BASE_TOOL_STRATEGY.md` - Full product strategy and architecture
- `docs/KNOWLEDGE_BASE_API_REQUIREMENTS.md` - Complete API specification
- Parent project: `/mnt/d/dev/smartai/consulting/deep-vibe/nexus/techstack.md` - Full tech stack
