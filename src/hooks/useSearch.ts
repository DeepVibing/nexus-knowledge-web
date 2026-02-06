/**
 * Search Hooks for Nexus Knowledge
 */

import { useQuery } from '@tanstack/react-query';
import { searchApi } from '../services/search';
import { kbKeys } from '../types';
import type { SearchRequest } from '../types';

/**
 * Search across workspace content
 */
export function useSearch(
  workspaceId: string | undefined,
  query: string,
  options?: Omit<SearchRequest, 'query'>
) {
  return useQuery({
    queryKey: kbKeys.search.results(workspaceId ?? '', query, options?.filters as Record<string, unknown> | undefined),
    queryFn: () => searchApi.search(workspaceId!, { query, ...options }),
    enabled: !!workspaceId && query.length >= 2,
    staleTime: 1000 * 60 * 5,
  });
}
