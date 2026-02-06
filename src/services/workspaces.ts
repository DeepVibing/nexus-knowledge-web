/**
 * Workspaces Service for Nexus Knowledge
 */

import { apiClient } from '../lib/api-client';
import type {
  WorkspaceDto,
  WorkspaceDetailDto,
  WorkspaceMemberDto,
  WorkspaceListParams,
  WorkspaceListResponse,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  InviteMemberRequest,
  UpdateMemberRoleRequest,
} from '../types';

const BASE_URL = '/api/v1/kb/workspaces';

export const workspacesApi = {
  list: async (params: WorkspaceListParams = {}): Promise<WorkspaceListResponse> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.set('page', params.page.toString());
    if (params.pageSize) queryParams.set('pageSize', params.pageSize.toString());
    if (params.search) queryParams.set('search', params.search);

    const url = `${BASE_URL}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.getRaw<WorkspaceListResponse>(url);
  },

  get: async (id: string): Promise<WorkspaceDetailDto> => {
    return apiClient.getRaw<WorkspaceDetailDto>(`${BASE_URL}/${id}`);
  },

  create: async (data: CreateWorkspaceRequest): Promise<WorkspaceDto> => {
    return apiClient.postRaw<WorkspaceDto>(BASE_URL, data);
  },

  update: async (id: string, data: UpdateWorkspaceRequest): Promise<WorkspaceDto> => {
    return apiClient.putRaw<WorkspaceDto>(`${BASE_URL}/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.deleteRaw(`${BASE_URL}/${id}`);
  },

  // Members
  listMembers: async (workspaceId: string): Promise<WorkspaceMemberDto[]> => {
    return apiClient.getRaw<WorkspaceMemberDto[]>(`${BASE_URL}/${workspaceId}/members`);
  },

  inviteMember: async (workspaceId: string, data: InviteMemberRequest): Promise<WorkspaceMemberDto> => {
    return apiClient.postRaw<WorkspaceMemberDto>(`${BASE_URL}/${workspaceId}/members`, data);
  },

  updateMemberRole: async (
    workspaceId: string,
    userId: string,
    data: UpdateMemberRoleRequest
  ): Promise<WorkspaceMemberDto> => {
    return apiClient.putRaw<WorkspaceMemberDto>(`${BASE_URL}/${workspaceId}/members/${userId}`, data);
  },

  removeMember: async (workspaceId: string, userId: string): Promise<void> => {
    await apiClient.deleteRaw(`${BASE_URL}/${workspaceId}/members/${userId}`);
  },
};

export default workspacesApi;
