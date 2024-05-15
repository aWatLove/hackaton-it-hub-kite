import { QueryClient, useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { DefaultError, QueryFilters, QueryKey } from '@tanstack/query-core';
import { cache } from 'react';

export const AUTH_DEPEND = 'AUTH_DEPEND';
export function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnMount: false,
                // With SSR, we usually want to set some default staleTime
                // above 0 to avoid refetching immediately on the client
                staleTime: 60 * 1000,
            },
        },
    });
}

var browserQueryClient: QueryClient | undefined = undefined;

export const getQueryClient = cache(() => {
    if (typeof window === 'undefined') {
        // Server: always make a new query client
        return makeQueryClient();
    } else {
        // Browser: make a new query client if we don't already have one
        // This is very important so we don't re-make a new client if React
        // suspends during the initial render. This may not be needed if we
        // have a suspense boundary BELOW the creation of the query client
        if (!browserQueryClient) browserQueryClient = makeQueryClient();
        return browserQueryClient;
    }
});
export const useOptimisticMutation = <TData = unknown, TError = DefaultError, TVariables = void, TContext = unknown>(
    options: UseMutationOptions<TData, TError, TVariables, TContext> & {
        invalidate?: QueryKey | QueryKey[] | QueryFilters['predicate'];
    },
    client: QueryClient = getQueryClient(),
): UseMutationResult<TData, TError, TVariables, TContext> =>
    useMutation({
        ...options,
        onSuccess: async (data, error, context) => {
            await options?.onSuccess?.(data, error, context);
            if (options.invalidate) {
                await client.invalidateQueries({
                    predicate: (query) => {
                        //@ts-ignore
                        if (typeof options.invalidate === 'function') return options.invalidate(query);

                        const isSingleKey = options.invalidate!.every((key) => !Array.isArray(key));
                        if (isSingleKey) {
                            return JSON.stringify(options.invalidate) === JSON.stringify(query.queryKey);
                        }

                        return options.invalidate!.some((key) => JSON.stringify(key) === JSON.stringify(query.queryKey));
                    },
                });
            }
        },
    });

export const revalidateAuth = () =>
    getQueryClient().invalidateQueries({
        predicate: (query) => query.queryKey.includes(AUTH_DEPEND),
    });
