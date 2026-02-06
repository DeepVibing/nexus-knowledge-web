/**
 * Workspace Hooks for Nexus Knowledge
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workspacesApi } from '../services/workspaces';
import { kbKeys } from '../types';
import type {
  WorkspaceListParams,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  InviteMemberRequest,
  UpdateMemberRoleRequest,
} from '../types';

/**
 * List workspaces
 */
export function useWorkspaces(params: WorkspaceListParams = {}) {
  return useQuery({
    queryKey: kbKeys.workspaces.list(params as Record<string, unknown>),
    queryFn: () => workspacesApi.list(params),
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Get workspace detail
 */
export function useWorkspace(workspaceId: string | undefined) {
  return useQuery({
    queryKey: kbKeys.workspaces.detail(workspaceId ?? ''),
    queryFn: () => workspacesApi.get(workspaceId!),
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Create workspace
 */
export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkspaceRequest) => workspacesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: kbKeys.workspaces.all() });
    },
  });
}

/**
 * Update workspace
 */
export function useUpdateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWorkspaceRequest }) =>
      workspacesApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: kbKeys.workspaces.detail(id) });
      queryClient.invalidateQueries({ queryKey: kbKeys.workspaces.all() });
    },
  });
}

/**
 * Delete workspace
 */
export function useDeleteWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => workspacesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: kbKeys.workspaces.all() });
    },
  });
}

/**
 * List workspace members
 */
export function useWorkspaceMembers(workspaceId: string | undefined) {
  return useQuery({
    queryKey: kbKeys.workspaces.members(workspaceId ?? ''),
    queryFn: () => workspacesApi.listMembers(workspaceId!),
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Invite member
 */
export function useInviteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, data }: { workspaceId: string; data: InviteMemberRequest }) =>
      workspacesApi.inviteMember(workspaceId, data),
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: kbKeys.workspaces.members(workspaceId) });
      queryClient.invalidateQueries({ queryKey: kbKeys.workspaces.detail(workspaceId) });
    },
  });
}

/**
 * Update member role
 */
export function useUpdateMemberRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      userId,
      data,
    }: {
      workspaceId: string;
      userId: string;
      data: UpdateMemberRoleRequest;
    }) => workspacesApi.updateMemberRole(workspaceId, userId, data),
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: kbKeys.workspaces.members(workspaceId) });
    },
  });
}

/**
 * Remove member
 */
export function useRemoveMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, userId }: { workspaceId: string; userId: string }) =>
      workspacesApi.removeMember(workspaceId, userId),
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: kbKeys.workspaces.members(workspaceId) });
      queryClient.invalidateQueries({ queryKey: kbKeys.workspaces.detail(workspaceId) });
    },
  });
}
