# Nexus Knowledge Web - Tech Stack

## Core Framework
- **React 19** - UI framework
- **TypeScript 5.9+** - Type safety
- **Vite 7** - Build tool

## Styling
- **Tailwind CSS 4** - Utility-first CSS
- **clsx + tailwind-merge** - Class name utilities

## State Management
- **TanStack Query (React Query)** - Server state management
- **React Context** - App state (auth, toast, theme, workspace)
- **React Hook Form + Zod** - Form handling and validation

## Routing
- **React Router 7** - Client-side routing with lazy loading

## API Communication
- **Axios** - HTTP client with interceptors

## Icons
- **Lucide React** - Icon library

## Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing

## API Integration
- Base URL: `/api/v1/kb/workspaces/{workspaceId}/...`
- Authentication: JWT Bearer token
- Headers: `Authorization`, `X-Workspace-ID`

## Directory Structure
```
src/
├── lib/           # Core utilities (api-client, react-query, utils)
├── config/        # Constants, routes, query keys
├── types/         # TypeScript type definitions
├── services/      # API service adapters
├── hooks/         # TanStack Query hooks
├── contexts/      # React contexts (Auth, Toast, Theme, Workspace)
├── components/
│   ├── common/    # Reusable UI components
│   ├── layout/    # App shell, sidebar, header
│   ├── chat/      # Chat/RAG components
│   ├── sources/   # Source management
│   └── entities/  # Entity browser
└── pages/         # Route page components
```

## Build Output
- Production build: ~500KB (gzipped: ~160KB)
- Code splitting enabled via lazy imports
- Separate chunks for each page
