# Nexus Knowledge Web - Architecture Design

## Overview

React/TypeScript frontend for the Knowledge Base tool - a NotebookLM-style application with RAG-powered chat, source ingestion, entity extraction, and collaborative workspaces.

## Tech Stack

- **Framework:** React 19 + TypeScript 5.9+
- **Build:** Vite 7+
- **Styling:** Tailwind CSS 4+
- **State:** TanStack Query (server state), React Context (app state)
- **Routing:** React Router 7+
- **Forms:** React Hook Form + Zod
- **API Client:** Axios

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                        Pages Layer                               │
│  (Login, Register, WorkspaceList, ChatPage, SourcesPage, etc.)  │
├─────────────────────────────────────────────────────────────────┤
│                     Components Layer                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ Common  │ │ Layout  │ │  Chat   │ │ Sources │ │Entities │   │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                      Contexts Layer                              │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌───────────┐             │
│  │  Auth   │ │  Toast  │ │  Theme  │ │ Workspace │             │
│  └─────────┘ └─────────┘ └─────────┘ └───────────┘             │
├─────────────────────────────────────────────────────────────────┤
│                       Hooks Layer                                │
│  (useWorkspaces, useSources, useChat, useEntities, useSearch)   │
├─────────────────────────────────────────────────────────────────┤
│                     Services Layer                               │
│  (authService, workspacesApi, sourcesApi, chatApi, etc.)        │
├─────────────────────────────────────────────────────────────────┤
│                       API Client                                 │
│  (Axios with interceptors for auth tokens)                      │
└─────────────────────────────────────────────────────────────────┘
```

## Authentication Flow

### Registration Flow

```
┌─────────┐      ┌─────────────┐      ┌──────────────┐
│ Register│      │ AuthContext │      │ Auth Service │
│  Page   │      │             │      │              │
└────┬────┘      └──────┬──────┘      └──────┬───────┘
     │                  │                    │
     │ Submit form      │                    │
     │─────────────────>│                    │
     │                  │ POST /auth/register│
     │                  │───────────────────>│
     │                  │                    │
     │                  │ TokenResponse      │
     │                  │<───────────────────│
     │                  │                    │
     │                  │ Store tokens       │
     │                  │ Schedule refresh   │
     │                  │ Update user state  │
     │                  │                    │
     │ Navigate to      │                    │
     │ /workspaces      │                    │
     │<─────────────────│                    │
     │                  │                    │
```

### Login Flow

```
┌─────────┐      ┌─────────────┐      ┌──────────────┐
│  Login  │      │ AuthContext │      │ Auth Service │
│  Page   │      │             │      │              │
└────┬────┘      └──────┬──────┘      └──────┬───────┘
     │                  │                    │
     │ Submit form      │                    │
     │─────────────────>│                    │
     │                  │ POST /auth/login   │
     │                  │───────────────────>│
     │                  │                    │
     │                  │ TokenResponse      │
     │                  │<───────────────────│
     │                  │                    │
     │                  │ Store tokens       │
     │                  │ Schedule refresh   │
     │                  │ Update user state  │
     │                  │                    │
     │ Navigate to      │                    │
     │ /workspaces      │                    │
     │<─────────────────│                    │
     │                  │                    │
```

### Token Refresh Flow

```
┌─────────────┐      ┌──────────────┐
│ AuthContext │      │ Auth Service │
│  (Timer)    │      │              │
└──────┬──────┘      └──────┬───────┘
       │                    │
       │ (5 min before      │
       │  token expiry)     │
       │                    │
       │ POST /auth/refresh │
       │───────────────────>│
       │                    │
       │ TokenResponse      │
       │<───────────────────│
       │                    │
       │ Store new tokens   │
       │ Reschedule refresh │
       │                    │
```

### Session Initialization (Page Load)

```
┌─────────────┐      ┌──────────────┐
│ AuthContext │      │ Auth Service │
│  (useEffect)│      │              │
└──────┬──────┘      └──────┬───────┘
       │                    │
       │ Check localStorage │
       │ for tokens         │
       │                    │
       │ [Has tokens]       │
       │                    │
       │ Check token expiry │
       │                    │
       │ [Near expiry]      │
       │ POST /auth/refresh │
       │───────────────────>│
       │                    │
       │ [Refresh fails]    │
       │ GET /auth/me       │
       │───────────────────>│
       │                    │
       │ [Success] Update   │
       │ user state         │
       │                    │
       │ [Failure] Clear    │
       │ tokens, redirect   │
       │ to login           │
       │                    │
```

## API Base URL Pattern

All Knowledge Base API endpoints follow this pattern:

```
/api/v1/kb/workspaces/{workspaceId}/...
```

Auth endpoints:
```
/api/v1/kb/auth/register
/api/v1/kb/auth/login
/api/v1/kb/auth/refresh
/api/v1/kb/auth/me
/api/v1/kb/auth/logout
```

## State Management Strategy

1. **Server State (TanStack Query)**
   - Workspaces, Sources, Conversations, Entities, Search results
   - Automatic caching, refetching, and invalidation
   - Query key factory for consistent cache management

2. **App State (React Context)**
   - **AuthContext:** User auth, tokens, login/logout
   - **ToastContext:** Notification system
   - **ThemeContext:** Dark/light mode
   - **WorkspaceContext:** Active workspace, sync with URL

3. **Local State**
   - Form state (React Hook Form)
   - UI state (modals, dropdowns)

## Directory Structure

```
src/
├── lib/
│   ├── api-client.ts       # Axios wrapper with interceptors
│   ├── react-query.ts      # QueryClient config
│   └── utils.ts            # cn() helper
├── config/
│   └── constants.ts        # Routes, keys, config
├── types/                  # TypeScript definitions
├── services/               # Pure API adapters
├── hooks/                  # TanStack Query hooks
├── contexts/               # React contexts
├── components/
│   ├── common/             # Reusable UI components
│   ├── layout/             # App shell
│   ├── chat/               # Chat/RAG components
│   ├── sources/            # Source management
│   └── entities/           # Entity browser
└── pages/                  # Route components
```

## Security Considerations

1. **Token Storage:** Access and refresh tokens in localStorage
2. **Token Refresh:** Automatic refresh 5 minutes before expiry
3. **401 Handling:** API client intercepts 401, clears tokens, redirects to login
4. **Protected Routes:** `RequireAuth` component wraps authenticated routes
5. **Public Routes:** `PublicRoute` redirects authenticated users to workspaces
