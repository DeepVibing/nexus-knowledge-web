/**
 * Chat Service for Nexus Knowledge
 */

import { apiClient } from '../lib/api-client';
import { API_CONFIG } from '../config/constants';
import type {
  AskRequest,
  AskResponse,
  ConversationDto,
  ConversationListParams,
  ConversationListResponse,
} from '../types';

const getBaseUrl = (workspaceId: string) => `/api/v1/kb/workspaces/${workspaceId}`;

export const chatApi = {
  ask: async (workspaceId: string, data: AskRequest): Promise<AskResponse> => {
    return apiClient.postRaw<AskResponse>(
      `${getBaseUrl(workspaceId)}/ask`,
      data,
      { timeout: API_CONFIG.longTimeout }
    );
  },

  listConversations: async (
    workspaceId: string,
    params: ConversationListParams = {}
  ): Promise<ConversationListResponse> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.set('page', params.page.toString());
    if (params.pageSize) queryParams.set('pageSize', params.pageSize.toString());
    if (params.search) queryParams.set('search', params.search);

    const url = `${getBaseUrl(workspaceId)}/conversations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.getRaw<ConversationListResponse>(url);
  },

  getConversation: async (workspaceId: string, conversationId: string): Promise<ConversationDto> => {
    return apiClient.getRaw<ConversationDto>(
      `${getBaseUrl(workspaceId)}/conversations/${conversationId}`
    );
  },

  deleteConversation: async (workspaceId: string, conversationId: string): Promise<void> => {
    await apiClient.deleteRaw(`${getBaseUrl(workspaceId)}/conversations/${conversationId}`);
  },

  updateConversationTitle: async (
    workspaceId: string,
    conversationId: string,
    title: string
  ): Promise<ConversationDto> => {
    return apiClient.patchRaw<ConversationDto>(
      `${getBaseUrl(workspaceId)}/conversations/${conversationId}`,
      { title }
    );
  },
};

export default chatApi;
