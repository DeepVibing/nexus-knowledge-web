/**
 * Workspace Types for Nexus Knowledge
 */

export type WorkspaceVisibility = 'private' | 'team' | 'public';
export type WorkspaceMemberRole = 'owner' | 'admin' | 'editor' | 'viewer';

export interface WorkspaceDto {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  visibility: WorkspaceVisibility;
  sourcesCount: number;
  membersCount: number;
  lastActivityAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceDetailDto extends WorkspaceDto {
  settings: WorkspaceSettings;
  stats: WorkspaceStats;
  members: WorkspaceMemberDto[];
}

export interface WorkspaceSettings {
  defaultEmbeddingModel?: string;
  defaultLlmModel?: string;
  autoExtractEntities: boolean;
  retentionDays?: number;
}

export interface WorkspaceStats {
  sourcesCount: number;
  chunksCount: number;
  entitiesCount: number;
  conversationsCount: number;
  insightsCount: number;
}

export interface WorkspaceMemberDto {
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: WorkspaceMemberRole;
  joinedAt: string;
}

export interface CreateWorkspaceRequest {
  name: string;
  description?: string;
  icon?: string;
  visibility?: WorkspaceVisibility;
}

export interface UpdateWorkspaceRequest {
  name?: string;
  description?: string;
  icon?: string;
  visibility?: WorkspaceVisibility;
  settings?: Partial<WorkspaceSettings>;
}

export interface InviteMemberRequest {
  email: string;
  role: WorkspaceMemberRole;
}

export interface UpdateMemberRoleRequest {
  role: WorkspaceMemberRole;
}

export interface WorkspaceListParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface WorkspaceListResponse {
  data: WorkspaceDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
