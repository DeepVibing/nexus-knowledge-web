# Knowledge Base Tool - API Requirements

**Version:** 1.0
**Date:** February 4, 2026
**Reference:** Project Studio Knowledge Fabric API

---

## Overview

This document defines the API endpoints for the Knowledge Base Tool, following the architectural patterns established in Project Studio's Knowledge Fabric. The API is designed to support:

1. **Source Management** - Ingest, process, sync documents and integrations
2. **Fabric Chat** - RAG-powered Q&A with citations
3. **Entity System** - Extracted knowledge entities and relationships
4. **Insights** - Captured decisions and action items
5. **Export** - Data portability to multiple formats

---

## Base URL & Authentication

```
Base URL: /api/v1/kb
Auth: Bearer token (JWT)
Headers:
  Authorization: Bearer <token>
  X-Workspace-ID: <workspace_id>  (optional, can be in path)
```

---

## 1. Workspaces

### List Workspaces

```http
GET /api/v1/kb/workspaces
```

**Response:**
```json
{
  "data": [
    {
      "id": "ws_abc123",
      "name": "Product Knowledge Base",
      "description": "All product documentation and decisions",
      "icon": "📚",
      "visibility": "team",
      "sourcesCount": 42,
      "membersCount": 5,
      "lastActivityAt": "2026-02-04T10:30:00Z",
      "createdAt": "2026-01-15T08:00:00Z"
    }
  ],
  "total": 3
}
```

### Create Workspace

```http
POST /api/v1/kb/workspaces
```

**Request:**
```json
{
  "name": "Client Research",
  "description": "Research documents and meeting notes",
  "icon": "🔬",
  "visibility": "private"
}
```

### Get Workspace

```http
GET /api/v1/kb/workspaces/{workspaceId}
```

**Response:**
```json
{
  "id": "ws_abc123",
  "name": "Product Knowledge Base",
  "description": "All product documentation and decisions",
  "icon": "📚",
  "visibility": "team",
  "settings": {
    "defaultEmbeddingModel": "text-embedding-3-small",
    "defaultLlmModel": "claude-sonnet-4-20250514",
    "autoExtractEntities": true,
    "retentionDays": null
  },
  "stats": {
    "sourcesCount": 42,
    "chunksCount": 8540,
    "entitiesCount": 156,
    "conversationsCount": 89,
    "insightsCount": 23
  },
  "members": [
    {
      "userId": "user_123",
      "name": "Michael Gilday",
      "email": "michael@example.com",
      "role": "owner",
      "joinedAt": "2026-01-15T08:00:00Z"
    }
  ],
  "createdAt": "2026-01-15T08:00:00Z",
  "updatedAt": "2026-02-04T10:30:00Z"
}
```

### Update Workspace

```http
PATCH /api/v1/kb/workspaces/{workspaceId}
```

### Delete Workspace

```http
DELETE /api/v1/kb/workspaces/{workspaceId}
```

---

## 2. Sources

*Following Project Studio `/projects/{id}/sources` pattern*

### List Sources

```http
GET /api/v1/kb/workspaces/{workspaceId}/sources
```

**Query Parameters:**
- `status` - Filter by status: pending, processing, ready, failed, stale
- `sourceType` - Filter by type
- `search` - Search by name
- `page`, `pageSize` - Pagination

**Response:**
```json
{
  "data": [
    {
      "id": "src_def456",
      "name": "Product Roadmap 2026.pdf",
      "sourceType": "document",
      "status": "ready",
      "origin": {
        "uploadedFileName": "Product Roadmap 2026.pdf",
        "contentType": "application/pdf",
        "fileSize": 2456789
      },
      "processing": {
        "chunksCount": 45,
        "tokensCount": 12500,
        "pagesCount": 12,
        "processingDurationMs": 3400
      },
      "lastSyncedAt": "2026-02-04T09:00:00Z",
      "createdAt": "2026-02-01T14:30:00Z"
    },
    {
      "id": "src_ghi789",
      "name": "#product-updates",
      "sourceType": "slack_channel",
      "status": "ready",
      "origin": {
        "connector": "slack",
        "externalId": "C0123456789",
        "externalUrl": "https://workspace.slack.com/archives/C0123456789",
        "syncConfig": {
          "schedule": "hourly",
          "syncMode": "incremental"
        }
      },
      "processing": {
        "chunksCount": 234,
        "tokensCount": 45000,
        "messagesCount": 1250
      },
      "lastSyncedAt": "2026-02-04T10:00:00Z",
      "createdAt": "2026-01-20T10:00:00Z"
    }
  ],
  "total": 42,
  "page": 1,
  "pageSize": 20
}
```

### Add Source (Upload)

```http
POST /api/v1/kb/workspaces/{workspaceId}/sources
Content-Type: multipart/form-data
```

**Request:**
```
file: <binary>
name: "Q4 Strategy Document" (optional, defaults to filename)
tags: ["strategy", "2026"] (optional)
```

**Response:**
```json
{
  "id": "src_new123",
  "name": "Q4 Strategy Document.pdf",
  "sourceType": "document",
  "status": "processing",
  "processingJobId": "job_xyz789",
  "createdAt": "2026-02-04T11:00:00Z"
}
```

### Add Source (URL)

```http
POST /api/v1/kb/workspaces/{workspaceId}/sources/url
```

**Request:**
```json
{
  "url": "https://example.com/documentation",
  "name": "Product Documentation",
  "crawlDepth": 1,
  "includePaths": ["/docs/*"],
  "excludePaths": ["/docs/archive/*"]
}
```

### Add Source (Integration)

```http
POST /api/v1/kb/workspaces/{workspaceId}/sources/connect
```

**Request:**
```json
{
  "connectorId": "slack",
  "externalId": "C0123456789",
  "name": "#product-updates",
  "syncConfig": {
    "schedule": "hourly",
    "syncMode": "incremental",
    "historyDays": 90
  }
}
```

### Get Source

```http
GET /api/v1/kb/workspaces/{workspaceId}/sources/{sourceId}
```

**Response:**
```json
{
  "id": "src_def456",
  "name": "Product Roadmap 2026.pdf",
  "sourceType": "document",
  "status": "ready",
  "origin": {
    "uploadedFileName": "Product Roadmap 2026.pdf",
    "contentType": "application/pdf",
    "fileSize": 2456789,
    "checksum": "sha256:abc123..."
  },
  "processing": {
    "chunksCount": 45,
    "tokensCount": 12500,
    "pagesCount": 12,
    "processingDurationMs": 3400,
    "embeddingModel": "text-embedding-3-small"
  },
  "metadata": {
    "title": "Product Roadmap 2026",
    "author": "Product Team",
    "dateCreated": "2026-01-15",
    "language": "en"
  },
  "extractedEntities": [
    { "entityId": "ent_123", "name": "Nexus Platform", "type": "project" },
    { "entityId": "ent_456", "name": "Michael Gilday", "type": "person" }
  ],
  "tags": ["roadmap", "2026", "strategy"],
  "lastSyncedAt": "2026-02-04T09:00:00Z",
  "createdAt": "2026-02-01T14:30:00Z",
  "updatedAt": "2026-02-04T09:00:00Z"
}
```

### Sync Source

```http
POST /api/v1/kb/workspaces/{workspaceId}/sources/{sourceId}/sync
```

**Request:**
```json
{
  "fullSync": false
}
```

**Response:**
```json
{
  "jobId": "job_sync123",
  "status": "queued",
  "queuePosition": 2
}
```

### Delete Source

```http
DELETE /api/v1/kb/workspaces/{workspaceId}/sources/{sourceId}
```

### Get Source Processing Job

```http
GET /api/v1/kb/workspaces/{workspaceId}/sources/jobs/{jobId}
```

**Response:**
```json
{
  "jobId": "job_xyz789",
  "sourceId": "src_new123",
  "status": "processing",
  "progress": 65,
  "currentStep": "embedding",
  "steps": [
    { "name": "upload", "status": "completed", "durationMs": 1200 },
    { "name": "parsing", "status": "completed", "durationMs": 3400 },
    { "name": "chunking", "status": "completed", "durationMs": 800 },
    { "name": "embedding", "status": "processing", "progress": 45 },
    { "name": "indexing", "status": "pending" }
  ],
  "error": null,
  "startedAt": "2026-02-04T11:00:05Z"
}
```

---

## 3. Fabric Chat

*Following Project Studio `/projects/{id}/ask` pattern*

### Ask Question

```http
POST /api/v1/kb/workspaces/{workspaceId}/ask
```

**Request:**
```json
{
  "question": "What are the key milestones for Q2 2026?",
  "conversationId": "conv_existing123",

  "filters": {
    "sourceIds": ["src_def456", "src_ghi789"],
    "sourceTypes": ["document", "meeting"],
    "dateRange": {
      "start": "2026-01-01",
      "end": "2026-06-30"
    },
    "tags": ["roadmap"]
  },

  "options": {
    "includeThinking": true,
    "citationMode": "inline",
    "responseFormat": "detailed",
    "maxSources": 10
  }
}
```

**Response:**
```json
{
  "answer": "Based on the Product Roadmap 2026 document, the key Q2 milestones are:\n\n1. **April 15**: Launch Knowledge Base v1.0 [1]\n2. **May 1**: Complete integration connectors (Slack, Notion) [1]\n3. **June 1**: Begin enterprise pilot program [2]\n\nThese milestones align with the strategy discussed in the January planning meeting, where the team emphasized the importance of early market validation [3].",

  "citations": [
    {
      "id": "cit_1",
      "sourceId": "src_def456",
      "sourceName": "Product Roadmap 2026.pdf",
      "chunkId": "chunk_abc",
      "text": "Q2 Milestones: April 15 - KB v1.0 launch, May 1 - Integration connectors complete",
      "pageNumber": 5,
      "relevanceScore": 0.94
    },
    {
      "id": "cit_2",
      "sourceId": "src_def456",
      "sourceName": "Product Roadmap 2026.pdf",
      "chunkId": "chunk_def",
      "text": "Enterprise pilot program begins June 1st with 3 initial customers",
      "pageNumber": 8,
      "relevanceScore": 0.89
    },
    {
      "id": "cit_3",
      "sourceId": "src_meet123",
      "sourceName": "January Planning Meeting",
      "chunkId": "chunk_ghi",
      "text": "Michael emphasized getting to market quickly for validation",
      "timestamp": { "start": 1234, "end": 1289 },
      "relevanceScore": 0.82
    }
  ],

  "thinking": "The user is asking about Q2 2026 milestones. I found relevant information in the Product Roadmap document (pages 5-8) and the January planning meeting. The roadmap lists specific dates, while the meeting provides context on why these milestones were chosen.",

  "relatedEntities": [
    { "id": "ent_123", "name": "Nexus Platform", "type": "project" },
    { "id": "ent_456", "name": "Knowledge Base", "type": "project" }
  ],

  "suggestedFollowUps": [
    "What are the success criteria for the enterprise pilot?",
    "Who are the target customers for the pilot program?",
    "What dependencies exist for the April launch?"
  ],

  "conversationId": "conv_new456",
  "messageId": "msg_abc123",

  "usage": {
    "promptTokens": 2450,
    "completionTokens": 380,
    "totalTokens": 2830,
    "retrievedChunks": 12
  }
}
```

### List Conversations

```http
GET /api/v1/kb/workspaces/{workspaceId}/conversations
```

**Query Parameters:**
- `search` - Search in conversation titles/content
- `page`, `pageSize` - Pagination

**Response:**
```json
{
  "data": [
    {
      "id": "conv_new456",
      "title": "Q2 Milestones Discussion",
      "messageCount": 5,
      "sourcesUsed": ["src_def456", "src_meet123"],
      "lastMessageAt": "2026-02-04T11:30:00Z",
      "createdAt": "2026-02-04T11:00:00Z"
    }
  ],
  "total": 89
}
```

### Get Conversation

```http
GET /api/v1/kb/workspaces/{workspaceId}/conversations/{conversationId}
```

**Response:**
```json
{
  "id": "conv_new456",
  "title": "Q2 Milestones Discussion",
  "messages": [
    {
      "id": "msg_001",
      "role": "user",
      "content": "What are the key milestones for Q2 2026?",
      "createdAt": "2026-02-04T11:00:00Z"
    },
    {
      "id": "msg_002",
      "role": "assistant",
      "content": "Based on the Product Roadmap 2026 document...",
      "citations": [...],
      "createdAt": "2026-02-04T11:00:05Z"
    },
    {
      "id": "msg_003",
      "role": "user",
      "content": "What are the dependencies for the April launch?",
      "createdAt": "2026-02-04T11:15:00Z"
    },
    {
      "id": "msg_004",
      "role": "assistant",
      "content": "The April launch has several key dependencies...",
      "citations": [...],
      "createdAt": "2026-02-04T11:15:08Z"
    }
  ],
  "sourcesUsed": ["src_def456", "src_meet123"],
  "entitiesDiscussed": ["ent_123", "ent_456"],
  "createdAt": "2026-02-04T11:00:00Z",
  "updatedAt": "2026-02-04T11:15:08Z"
}
```

### Delete Conversation

```http
DELETE /api/v1/kb/workspaces/{workspaceId}/conversations/{conversationId}
```

---

## 4. Search

### Semantic Search

```http
POST /api/v1/kb/workspaces/{workspaceId}/search
```

**Request:**
```json
{
  "query": "enterprise pilot program requirements",
  "limit": 20,
  "offset": 0,

  "filters": {
    "sourceIds": null,
    "sourceTypes": ["document", "meeting"],
    "entityTypes": null,
    "dateRange": null,
    "tags": null
  },

  "options": {
    "mode": "hybrid",
    "includeChunks": true,
    "includeEntities": true,
    "highlightMatches": true
  }
}
```

**Response:**
```json
{
  "results": [
    {
      "type": "chunk",
      "id": "chunk_pilot123",
      "score": 0.92,
      "sourceId": "src_def456",
      "sourceName": "Product Roadmap 2026.pdf",
      "content": "Enterprise pilot program requirements include: minimum 500 users, existing knowledge management challenges, willingness to provide feedback...",
      "highlights": ["<em>Enterprise pilot program</em> <em>requirements</em> include"],
      "pageNumber": 9
    },
    {
      "type": "entity",
      "id": "ent_pilot",
      "score": 0.85,
      "entityType": "project",
      "name": "Enterprise Pilot Program",
      "description": "Initial pilot program targeting 3 enterprise customers",
      "highlights": ["Initial <em>pilot program</em> targeting 3 <em>enterprise</em> customers"]
    }
  ],
  "totalCount": 45,
  "facets": {
    "sourceTypes": [
      { "type": "document", "count": 28 },
      { "type": "meeting", "count": 12 },
      { "type": "slack_channel", "count": 5 }
    ],
    "dateRanges": [
      { "range": "last_week", "count": 8 },
      { "range": "last_month", "count": 23 },
      { "range": "older", "count": 14 }
    ]
  }
}
```

---

## 5. Entities

*Following Project Studio Entity Registry pattern*

### List Entities

```http
GET /api/v1/kb/workspaces/{workspaceId}/entities
```

**Query Parameters:**
- `entityType` - Filter by type
- `search` - Search by name/aliases
- `tags` - Filter by tags
- `relatedTo` - Filter by relationship to entity ID
- `mentionedIn` - Filter by source ID
- `page`, `pageSize` - Pagination

**Response:**
```json
{
  "data": [
    {
      "id": "ent_123",
      "entityType": "project",
      "name": "Nexus Platform",
      "aliases": ["Nexus", "The Platform"],
      "description": "AI-powered creative production platform",
      "attributes": {
        "status": "active",
        "startDate": "2025-06-01",
        "team": ["Michael", "Bert", "Gonzo"]
      },
      "relationshipsCount": 12,
      "mentionsCount": 156,
      "tags": ["product", "core"],
      "createdAt": "2026-01-15T08:00:00Z"
    }
  ],
  "total": 156
}
```

### Get Entity

```http
GET /api/v1/kb/workspaces/{workspaceId}/entities/{entityId}
```

**Response:**
```json
{
  "id": "ent_123",
  "entityType": "project",
  "name": "Nexus Platform",
  "aliases": ["Nexus", "The Platform"],
  "description": "AI-powered creative production platform",
  "attributes": {
    "status": "active",
    "startDate": "2025-06-01",
    "team": ["Michael", "Bert", "Gonzo"],
    "techStack": ["React", ".NET", "PostgreSQL"]
  },
  "relationships": [
    {
      "targetEntityId": "ent_456",
      "targetEntityName": "Michael Gilday",
      "targetEntityType": "person",
      "relationshipType": "owned_by",
      "strength": 1.0
    },
    {
      "targetEntityId": "ent_789",
      "targetEntityName": "Knowledge Base",
      "targetEntityType": "project",
      "relationshipType": "contains",
      "strength": 0.9
    }
  ],
  "mentions": [
    {
      "sourceId": "src_def456",
      "sourceName": "Product Roadmap 2026.pdf",
      "chunkId": "chunk_abc",
      "context": "The Nexus Platform will serve as the foundation for all creative tools...",
      "pageNumber": 2,
      "confidence": 0.95
    }
  ],
  "notes": "Core product - prioritize all related work",
  "tags": ["product", "core", "priority"],
  "createdAt": "2026-01-15T08:00:00Z",
  "updatedAt": "2026-02-04T10:00:00Z"
}
```

### Create Entity

```http
POST /api/v1/kb/workspaces/{workspaceId}/entities
```

**Request:**
```json
{
  "entityType": "person",
  "name": "John Smith",
  "aliases": ["JS", "John S."],
  "description": "Technical lead for Platform team",
  "attributes": {
    "role": "Technical Lead",
    "team": "Platform",
    "email": "john@example.com"
  },
  "tags": ["team", "engineering"]
}
```

### Update Entity

```http
PATCH /api/v1/kb/workspaces/{workspaceId}/entities/{entityId}
```

**Request:**
```json
{
  "description": "Updated description",
  "notes": "Important context about this entity",
  "tags": ["updated", "tags"]
}
```

### Extract Entities

```http
POST /api/v1/kb/workspaces/{workspaceId}/entities/extract
```

**Request:**
```json
{
  "sourceIds": ["src_def456"],
  "entityTypes": ["person", "project", "company"],
  "options": {
    "mergeExisting": true,
    "confidenceThreshold": 0.7,
    "includeRelationships": true
  }
}
```

**Response:**
```json
{
  "jobId": "job_extract123",
  "status": "queued",
  "queuePosition": 1
}
```

### Get Extraction Job

```http
GET /api/v1/kb/workspaces/{workspaceId}/entities/jobs/{jobId}
```

**Response:**
```json
{
  "jobId": "job_extract123",
  "status": "completed",
  "results": {
    "entitiesCreated": 12,
    "entitiesMerged": 5,
    "relationshipsCreated": 23
  },
  "entities": [
    { "id": "ent_new1", "name": "New Entity", "type": "person" }
  ],
  "completedAt": "2026-02-04T11:05:00Z"
}
```

### Merge Entities

```http
POST /api/v1/kb/workspaces/{workspaceId}/entities/merge
```

**Request:**
```json
{
  "sourceEntityId": "ent_duplicate",
  "targetEntityId": "ent_primary",
  "mergeAliases": true,
  "mergeRelationships": true,
  "mergeMentions": true
}
```

---

## 6. Glossary

*Built on Entity system with type='term'*

### List Glossary Terms

```http
GET /api/v1/kb/workspaces/{workspaceId}/glossary
```

**Query Parameters:**
- `search` - Search terms
- `category` - Filter by category
- `page`, `pageSize` - Pagination

**Response:**
```json
{
  "data": [
    {
      "id": "term_001",
      "term": "RAG",
      "definition": "Retrieval Augmented Generation - a technique that enhances LLM responses by retrieving relevant context from a knowledge base before generating answers.",
      "aliases": ["Retrieval Augmented Generation"],
      "category": "AI/ML",
      "relatedTerms": ["LLM", "Vector Search", "Embedding"],
      "sourceReferences": ["src_def456"],
      "usageCount": 45,
      "createdAt": "2026-01-20T10:00:00Z"
    }
  ],
  "total": 78,
  "categories": ["AI/ML", "Product", "Business", "Technical"]
}
```

### Add Glossary Term

```http
POST /api/v1/kb/workspaces/{workspaceId}/glossary
```

**Request:**
```json
{
  "term": "Knowledge Fabric",
  "definition": "The RAG-powered chat interface that enables querying across all ingested sources with citations.",
  "aliases": ["KB Chat", "Fabric"],
  "category": "Product",
  "relatedTerms": ["RAG", "Citation"],
  "sourceReferences": ["src_def456"]
}
```

### Update Glossary Term

```http
PATCH /api/v1/kb/workspaces/{workspaceId}/glossary/{termId}
```

### Delete Glossary Term

```http
DELETE /api/v1/kb/workspaces/{workspaceId}/glossary/{termId}
```

---

## 7. Insights

*Following Project Studio Decisions pattern*

### List Insights

```http
GET /api/v1/kb/workspaces/{workspaceId}/insights
```

**Query Parameters:**
- `type` - Filter by type: decision, action_item, key_finding, question, note
- `status` - Filter by status: open, resolved, deferred
- `assignee` - Filter by assignee
- `search` - Search content
- `page`, `pageSize` - Pagination

**Response:**
```json
{
  "data": [
    {
      "id": "ins_001",
      "type": "decision",
      "title": "Launch Knowledge Base MVP in April",
      "content": "The team decided to target April 15 for the Knowledge Base v1.0 launch, focusing on core chat functionality and document ingestion.",
      "status": "resolved",
      "sourceIds": ["src_meet123"],
      "conversationId": "conv_abc",
      "linkedEntities": ["ent_kb123"],
      "tags": ["roadmap", "launch"],
      "createdBy": "Michael Gilday",
      "createdAt": "2026-01-25T14:00:00Z"
    },
    {
      "id": "ins_002",
      "type": "action_item",
      "title": "Complete Slack integration",
      "content": "Bert to complete Slack connector implementation by end of March",
      "status": "open",
      "assignee": "Bert Nieves",
      "dueDate": "2026-03-31",
      "sourceIds": ["src_meet123"],
      "tags": ["integration", "development"],
      "createdBy": "Michael Gilday",
      "createdAt": "2026-01-25T14:15:00Z"
    }
  ],
  "total": 23,
  "stats": {
    "open": 8,
    "resolved": 12,
    "deferred": 3
  }
}
```

### Create Insight

```http
POST /api/v1/kb/workspaces/{workspaceId}/insights
```

**Request:**
```json
{
  "type": "key_finding",
  "title": "Users prefer inline citations",
  "content": "User research indicates strong preference for inline citations over footnotes. 85% of users found inline citations more useful for validating information.",
  "sourceIds": ["src_research123"],
  "conversationId": "conv_xyz",
  "linkedEntities": ["ent_citations"],
  "tags": ["ux", "research"]
}
```

### Update Insight

```http
PATCH /api/v1/kb/workspaces/{workspaceId}/insights/{insightId}
```

**Request:**
```json
{
  "status": "resolved",
  "content": "Updated content with resolution"
}
```

### Delete Insight

```http
DELETE /api/v1/kb/workspaces/{workspaceId}/insights/{insightId}
```

### Capture Insight from Conversation

```http
POST /api/v1/kb/workspaces/{workspaceId}/conversations/{conversationId}/capture-insight
```

**Request:**
```json
{
  "type": "decision",
  "messageIds": ["msg_003", "msg_004"],
  "title": "Auto-generated title from messages",
  "tags": ["auto-captured"]
}
```

---

## 8. Export

### Create Export Job

```http
POST /api/v1/kb/workspaces/{workspaceId}/export
```

**Request:**
```json
{
  "format": "obsidian",
  "options": {
    "includeContent": true,
    "includeCitations": true,
    "includeEntities": true,
    "includeInsights": true,
    "sourceIds": null,
    "dateRange": null
  }
}
```

**Response:**
```json
{
  "jobId": "job_export123",
  "status": "queued",
  "estimatedSizeMb": 45
}
```

### Get Export Job

```http
GET /api/v1/kb/workspaces/{workspaceId}/export/jobs/{jobId}
```

**Response:**
```json
{
  "jobId": "job_export123",
  "status": "completed",
  "format": "obsidian",
  "downloadUrl": "https://storage.example.com/exports/job_export123.zip",
  "expiresAt": "2026-02-11T11:00:00Z",
  "stats": {
    "sourcesExported": 42,
    "entitiesExported": 156,
    "insightsExported": 23,
    "totalSizeMb": 38.5
  },
  "completedAt": "2026-02-04T11:10:00Z"
}
```

### List Export History

```http
GET /api/v1/kb/workspaces/{workspaceId}/export/history
```

---

## 9. Connectors

### List Available Connectors

```http
GET /api/v1/kb/connectors
```

**Response:**
```json
{
  "data": [
    {
      "id": "slack",
      "name": "Slack",
      "description": "Import messages from Slack channels",
      "icon": "slack",
      "authType": "oauth",
      "capabilities": ["read", "sync", "webhook"],
      "syncModes": ["full", "incremental"],
      "status": "available"
    },
    {
      "id": "notion",
      "name": "Notion",
      "description": "Import pages and databases from Notion",
      "icon": "notion",
      "authType": "oauth",
      "capabilities": ["read", "sync"],
      "syncModes": ["full", "incremental"],
      "status": "available"
    },
    {
      "id": "obsidian",
      "name": "Obsidian",
      "description": "Import markdown files from Obsidian vault",
      "icon": "obsidian",
      "authType": "local",
      "capabilities": ["read"],
      "syncModes": ["full"],
      "status": "available"
    }
  ]
}
```

### Get Connected Integrations

```http
GET /api/v1/kb/workspaces/{workspaceId}/connectors
```

**Response:**
```json
{
  "data": [
    {
      "id": "conn_slack123",
      "connectorId": "slack",
      "name": "Slack - Workspace",
      "status": "connected",
      "lastSyncAt": "2026-02-04T10:00:00Z",
      "sourcesCount": 5,
      "authExpiresAt": "2026-03-04T00:00:00Z",
      "createdAt": "2026-01-20T10:00:00Z"
    }
  ]
}
```

### Connect Integration

```http
POST /api/v1/kb/workspaces/{workspaceId}/connectors/{connectorId}/connect
```

**Request (OAuth):**
```json
{
  "authCode": "oauth_code_from_redirect",
  "redirectUri": "https://app.example.com/oauth/callback"
}
```

**Request (API Key):**
```json
{
  "apiKey": "api_key_123"
}
```

### Disconnect Integration

```http
DELETE /api/v1/kb/workspaces/{workspaceId}/connectors/{connectionId}
```

### List Available Resources

```http
GET /api/v1/kb/workspaces/{workspaceId}/connectors/{connectionId}/resources
```

**Response:**
```json
{
  "data": [
    {
      "externalId": "C0123456789",
      "name": "#product-updates",
      "type": "channel",
      "membersCount": 45,
      "isConnected": true
    },
    {
      "externalId": "C9876543210",
      "name": "#engineering",
      "type": "channel",
      "membersCount": 23,
      "isConnected": false
    }
  ]
}
```

---

## 10. Workspace Sharing

### List Members

```http
GET /api/v1/kb/workspaces/{workspaceId}/members
```

### Invite Member

```http
POST /api/v1/kb/workspaces/{workspaceId}/members
```

**Request:**
```json
{
  "email": "gonzo@example.com",
  "role": "editor"
}
```

### Update Member Role

```http
PATCH /api/v1/kb/workspaces/{workspaceId}/members/{userId}
```

**Request:**
```json
{
  "role": "viewer"
}
```

### Remove Member

```http
DELETE /api/v1/kb/workspaces/{workspaceId}/members/{userId}
```

---

## Error Responses

All endpoints follow standard error format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "question",
        "message": "Question is required"
      }
    ]
  }
}
```

**Error Codes:**

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request parameters |
| `UNAUTHORIZED` | 401 | Missing or invalid auth token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict (e.g., duplicate) |
| `PROCESSING_FAILED` | 422 | Processing error (e.g., unsupported file) |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Rate Limits

| Endpoint Category | Limit |
|-------------------|-------|
| Ask/Chat | 30 requests/minute |
| Search | 60 requests/minute |
| Source Upload | 10 requests/minute |
| Entity Extraction | 5 requests/minute |
| Export | 2 requests/minute |
| Other | 120 requests/minute |

---

## Webhook Events

For integrations that support webhooks:

```json
{
  "event": "source.ready",
  "workspaceId": "ws_abc123",
  "payload": {
    "sourceId": "src_def456",
    "name": "Document.pdf",
    "chunksCount": 45
  },
  "timestamp": "2026-02-04T11:00:00Z"
}
```

**Event Types:**
- `source.ready` - Source processing completed
- `source.failed` - Source processing failed
- `source.synced` - Integration source synced
- `entity.extracted` - Entity extraction completed
- `export.ready` - Export download ready

---

**Document Owner:** Engineering Team
**Last Updated:** February 4, 2026
