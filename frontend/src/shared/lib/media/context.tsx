import { createContext } from '@/shared/lib/createContext/createContext';

export const isMobile = (userAgent: string): boolean => {
    return /android.+mobile|ip(hone|[oa]d)/i.test(userAgent);
};
export const { Provider: DeviceDetectProvider, useStore: useDetectIsMobileDevice } = createContext<{ isMobile: boolean }, { userAgent: string }>(
    ({ userAgent }) => {
        return { isMobile: isMobile(userAgent) };
    },
);
