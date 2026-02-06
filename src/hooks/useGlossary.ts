/**
 * Glossary Hooks for Nexus Knowledge
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { glossaryApi } from '../services/glossary';
import { kbKeys } from '../types';
import type {
  GlossaryTermListParams,
  CreateGlossaryTermRequest,
  UpdateGlossaryTermRequest,
} from '../types';

/**
 * List glossary terms
 */
export function useGlossaryTerms(workspaceId: string | undefined, params: GlossaryTermListParams = {}) {
  return useQuery({
    queryKey: kbKeys.glossary.list(workspaceId ?? '', params as Record<string, unknown>),
    queryFn: () => glossaryApi.list(workspaceId!, params),
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Get glossary categories
 */
export function useGlossaryCategories(workspaceId: string | undefined) {
  return useQuery({
    queryKey: kbKeys.glossary.categories(workspaceId ?? ''),
    queryFn: () => glossaryApi.getCategories(workspaceId!),
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Get glossary term detail
 */
export function useGlossaryTerm(workspaceId: string | undefined, termId: string | undefined) {
  return useQuery({
    queryKey: kbKeys.glossary.detail(workspaceId ?? '', termId ?? ''),
    queryFn: () => glossaryApi.get(workspaceId!, termId!),
    enabled: !!workspaceId && !!termId,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Create glossary term
 */
export function useCreateGlossaryTerm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      data,
    }: {
      workspaceId: string;
      data: CreateGlossaryTermRequest;
    }) => glossaryApi.create(workspaceId, data),
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: kbKeys.glossary.all(workspaceId) });
    },
  });
}

/**
 * Update glossary term
 */
export function useUpdateGlossaryTerm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      termId,
      data,
    }: {
      workspaceId: string;
      termId: string;
      data: UpdateGlossaryTermRequest;
    }) => glossaryApi.update(workspaceId, termId, data),
    onSuccess: (_, { workspaceId, termId }) => {
      queryClient.invalidateQueries({ queryKey: kbKeys.glossary.all(workspaceId) });
      queryClient.invalidateQueries({ queryKey: kbKeys.glossary.detail(workspaceId, termId) });
    },
  });
}

/**
 * Delete glossary term
 */
export function useDeleteGlossaryTerm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      termId,
    }: {
      workspaceId: string;
      termId: string;
    }) => glossaryApi.delete(workspaceId, termId),
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: kbKeys.glossary.all(workspaceId) });
    },
  });
}
