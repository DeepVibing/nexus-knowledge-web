/**
 * Chat Hooks for Nexus Knowledge
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '../services/chat';
import { kbKeys } from '../types';
import type { AskRequest, ConversationListParams } from '../types';

/**
 * Ask a question (RAG chat)
 */
export function useAsk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, data }: { workspaceId: string; data: AskRequest }) =>
      chatApi.ask(workspaceId, data),
    onSuccess: (response, { workspaceId }) => {
      // Invalidate conversations list to show the new/updated conversation
      queryClient.invalidateQueries({ queryKey: kbKeys.conversations.all(workspaceId) });
      // Update conversation detail if it exists
      queryClient.invalidateQueries({
        queryKey: kbKeys.conversations.detail(workspaceId, response.conversationId),
      });
    },
  });
}

/**
 * List conversations
 */
export function useConversations(workspaceId: string | undefined, params: ConversationListParams = {}) {
  return useQuery({
    queryKey: kbKeys.conversations.list(workspaceId ?? '', params as Record<string, unknown>),
    queryFn: () => chatApi.listConversations(workspaceId!, params),
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Get conversation detail
 */
export function useConversation(workspaceId: string | undefined, conversationId: string | undefined) {
  return useQuery({
    queryKey: kbKeys.conversations.detail(workspaceId ?? '', conversationId ?? ''),
    queryFn: () => chatApi.getConversation(workspaceId!, conversationId!),
    enabled: !!workspaceId && !!conversationId,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Delete conversation
 */
export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, conversationId }: { workspaceId: string; conversationId: string }) =>
      chatApi.deleteConversation(workspaceId, conversationId),
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: kbKeys.conversations.all(workspaceId) });
    },
  });
}

/**
 * Update conversation title
 */
export function useUpdateConversationTitle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      conversationId,
      title,
    }: {
      workspaceId: string;
      conversationId: string;
      title: string;
    }) => chatApi.updateConversationTitle(workspaceId, conversationId, title),
    onSuccess: (_, { workspaceId, conversationId }) => {
      queryClient.invalidateQueries({
        queryKey: kbKeys.conversations.detail(workspaceId, conversationId),
      });
      queryClient.invalidateQueries({ queryKey: kbKeys.conversations.all(workspaceId) });
    },
  });
}
