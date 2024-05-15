// In Next.js, this file would be called: app/providers.jsx
'use client';

// We can not useState or useRef in a server component, which is why we are
// extracting this part out into it's own file with 'use client' on top
import { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '@/shared/ui/theme';
import { Theme } from '@radix-ui/themes';
import { getQueryClient } from '@/shared/lib/query/queryClient';
import { ErrorBoundary } from 'react-error-boundary';
import { DeviceDetectProvider } from '@/shared/lib/media/context';

export default function Providers({ children }: { children: ReactNode }) {
    // NOTE: Avoid useState when initializing the query client if you don't
    //       have a suspense boundary between this and the code that may
    //       suspend because React will throw away the client on the initial
    //       render if it suspends and there is no boundary
    const queryClient = getQueryClient();

    return (
        <ErrorBoundary FallbackComponent={() => <div>пуп</div>}>
            <QueryClientProvider client={queryClient}>
                {/*<HydrationBoundary queryClient={queryClient} state={dehydrate(queryClient)}>*/}
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                    <Theme hasBackground={false} radius="full">
                        {children}
                    </Theme>
                </ThemeProvider>
                <ReactQueryDevtools initialIsOpen={false} />
                {/*</HydrationBoundary>*/}
            </QueryClientProvider>
        </ErrorBoundary>
    );
}
export const ClientProviders = ({ userAgent, children }: { userAgent: string; children: ReactNode }) => {
    'use client';
    return <DeviceDetectProvider userAgent={userAgent}>{children}</DeviceDetectProvider>;
};
