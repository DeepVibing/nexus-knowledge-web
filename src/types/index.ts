/**
 * Nexus Knowledge Types - Re-exports and Query Keys
 */

// Re-exports
export * from './common';
export * from './auth';
export * from './workspace';
export * from './source';
export * from './chat';
export * from './entity';
export * from './search';
export * from './glossary';
export * from './insight';
export * from './export';
export * from './connector';

// Query Key Factory
export const kbKeys = {
  // Workspaces
  workspaces: {
    all: () => ['kb', 'workspaces'] as const,
    list: (params?: Record<string, unknown>) => [...kbKeys.workspaces.all(), 'list', params] as const,
    detail: (id: string) => [...kbKeys.workspaces.all(), id] as const,
    members: (id: string) => [...kbKeys.workspaces.detail(id), 'members'] as const,
  },

  // Sources
  sources: {
    all: (workspaceId: string) => ['kb', 'workspaces', workspaceId, 'sources'] as const,
    list: (workspaceId: string, params?: Record<string, unknown>) =>
      [...kbKeys.sources.all(workspaceId), 'list', params] as const,
    detail: (workspaceId: string, id: string) =>
      [...kbKeys.sources.all(workspaceId), id] as const,
    job: (workspaceId: string, sourceId: string, jobId: string) =>
      [...kbKeys.sources.detail(workspaceId, sourceId), 'jobs', jobId] as const,
  },

  // Conversations
  conversations: {
    all: (workspaceId: string) => ['kb', 'workspaces', workspaceId, 'conversations'] as const,
    list: (workspaceId: string, params?: Record<string, unknown>) =>
      [...kbKeys.conversations.all(workspaceId), 'list', params] as const,
    detail: (workspaceId: string, id: string) =>
      [...kbKeys.conversations.all(workspaceId), id] as const,
  },

  // Entities
  entities: {
    all: (workspaceId: string) => ['kb', 'workspaces', workspaceId, 'entities'] as const,
    list: (workspaceId: string, params?: Record<string, unknown>) =>
      [...kbKeys.entities.all(workspaceId), 'list', params] as const,
    detail: (workspaceId: string, id: string) =>
      [...kbKeys.entities.all(workspaceId), id] as const,
    extractionJob: (workspaceId: string, jobId: string) =>
      [...kbKeys.entities.all(workspaceId), 'extraction-jobs', jobId] as const,
  },

  // Search
  search: {
    results: (workspaceId: string, query: string, filters?: Record<string, unknown>) =>
      ['kb', 'workspaces', workspaceId, 'search', query, filters] as const,
  },

  // Glossary
  glossary: {
    all: (workspaceId: string) => ['kb', 'workspaces', workspaceId, 'glossary'] as const,
    list: (workspaceId: string, params?: Record<string, unknown>) =>
      [...kbKeys.glossary.all(workspaceId), 'list', params] as const,
    detail: (workspaceId: string, termId: string) =>
      [...kbKeys.glossary.all(workspaceId), termId] as const,
    categories: (workspaceId: string) =>
      [...kbKeys.glossary.all(workspaceId), 'categories'] as const,
  },

  // Insights
  insights: {
    all: (workspaceId: string) => ['kb', 'workspaces', workspaceId, 'insights'] as const,
    list: (workspaceId: string, params?: Record<string, unknown>) =>
      [...kbKeys.insights.all(workspaceId), 'list', params] as const,
    detail: (workspaceId: string, insightId: string) =>
      [...kbKeys.insights.all(workspaceId), insightId] as const,
    stats: (workspaceId: string) =>
      [...kbKeys.insights.all(workspaceId), 'stats'] as const,
  },

  // Exports
  exports: {
    all: (workspaceId: string) => ['kb', 'workspaces', workspaceId, 'exports'] as const,
    list: (workspaceId: string, params?: Record<string, unknown>) =>
      [...kbKeys.exports.all(workspaceId), 'list', params] as const,
    job: (workspaceId: string, jobId: string) =>
      [...kbKeys.exports.all(workspaceId), jobId] as const,
  },

  // Connectors
  connectors: {
    available: () => ['kb', 'connectors'] as const,
    connections: (workspaceId: string) => ['kb', 'workspaces', workspaceId, 'connectors'] as const,
    connectionList: (workspaceId: string, params?: Record<string, unknown>) =>
      [...kbKeys.connectors.connections(workspaceId), 'list', params] as const,
    connectionDetail: (workspaceId: string, connectionId: string) =>
      [...kbKeys.connectors.connections(workspaceId), connectionId] as const,
    resources: (workspaceId: string, connectionId: string) =>
      [...kbKeys.connectors.connectionDetail(workspaceId, connectionId), 'resources'] as const,
  },
} as const;
