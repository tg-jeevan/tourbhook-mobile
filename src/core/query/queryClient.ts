import { QueryClient } from '@tanstack/react-query';

/**
 * Single shared QueryClient for the app. Every feature's data-fetching hooks
 * (e.g. `useTrips()`, `usePackingList(tripId)`) should be built on top of
 * this via `useQuery`/`useMutation` — this is the direct replacement for
 * each Flutter feature's Bloc handling API-call loading/success/error state.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});