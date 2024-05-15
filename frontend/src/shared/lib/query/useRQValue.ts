'use client';
import { useQuery } from '@tanstack/react-query';
import { getQueryClient } from './queryClient';
import { NextPageContext } from 'next';
import { CookieService } from '@/shared/lib/cookie/CookieService';
import { context } from '@/shared/lib/axios/instance';

interface UseRQValue<T> {
    key: string;
    defaultValue: T;
}
const isJSON = (str: unknown): str is string => {
    if (typeof str !== 'string') {
        return false;
    }

    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }

    return true;
};
export const useRQValue = <T>({ key, defaultValue }: UseRQValue<T>) => {
    const client = getQueryClient();
    const value = useQuery({
        queryKey: [key],
        queryFn: () => defaultValue,
        refetchOnMount: false,
        staleTime: Infinity,
    }).data! as T;

    const setValue = (newValue: T | ((prev: T) => T)) => {
        client.setQueryData([key], newValue);
    };

    return [value, setValue] as const;
};

interface UseRQCookieValue<T> {
    key: string;
    defaultValue: T;
    cookie: string;
    transform?: (value: T, defaultValue: T) => T;
    canditionalCallbackOnChange?: () => { msg?: string; check?: boolean } | undefined;
}

export interface GetRqCookieValueQuery<T> extends UseRQCookieValue<T> {
    ctx?: NextPageContext;
}

const defaultTransform = <T>(value: T, defaultValue: T) => value ?? defaultValue;

export const getRQCookieValueQuery = <T>(options: GetRqCookieValueQuery<T>) => {
    const { key, defaultValue, cookie, ctx, transform = defaultTransform } = options;

    return {
        queryKey: [key],
        queryFn: () => {
            const cookieValue = CookieService.get(cookie, ctx) || context?.cookie?.get?.(cookie);
            const resolvedValue = (isJSON(cookieValue) ? JSON.parse(cookieValue) : cookieValue) as T;

            return transform(resolvedValue, defaultValue);
        },
        staleTime: 0,
    };
};

export const useRQCookieValue = <T>({ key, cookie, defaultValue, canditionalCallbackOnChange, transform = defaultTransform }: UseRQCookieValue<T>) => {
    const queryClient = getQueryClient();
    const { check = true, msg } = canditionalCallbackOnChange?.() ?? {};
    const value = useQuery(getRQCookieValueQuery({ key, cookie, defaultValue, transform })).data! as T;
    const setValue = (newValue: T | ((prev: T) => T)) => {
        if (!check) {
            if (msg) {
                console.warn(msg);
            }
            return;
        }
        queryClient.setQueryData([key], (prevValue: T) => {
            const newCookieValue = typeof newValue === 'function' ? (newValue as (prev: T) => T)(prevValue) : newValue;
            CookieService.set(cookie, JSON.stringify(newCookieValue));
            return newCookieValue;
        });
    };

    return { value: !check ? defaultValue : value, setValue } as const;
};
