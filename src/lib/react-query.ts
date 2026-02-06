import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ApiError } from '../types/common';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 0,
      onError: (error: unknown) => {
        const apiError = error as ApiError;
        console.error('Mutation error:', apiError.message);
      },
    },
  },
});

export { QueryClientProvider };
