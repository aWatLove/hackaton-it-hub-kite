import '../globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/shared/ui/toaster';
import Providers, { ClientProviders } from '@/config/providers';
import { ReactNode } from 'react';
import { Header } from '@/widgets/Header';
import { AuthModal } from '@/features/auth/ui/AuthModal';
import { cookies, headers } from 'next/headers';
import { ErrorBoundary } from '@/shared/lib/errorhandling/ErrorBoundary';
import { setContext } from '@/shared/lib/axios/instance';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'kite - форум для it-шников политеха',
    description: 'Тут можно делится проектами, принимать участие в разработке, найти друга',
};
const breakpoints = {
    mobile: 'xs',
    tablet: 'md',
    desktop: 'lg',
};
export default function ItHubRootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    setContext({ cookie: cookies() });
    const userAgent = headers().get('user-agent') || '';
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>
                    <ClientProviders userAgent={userAgent}>
                        <Header />
                        <ErrorBoundary>
                            <AuthModal />
                            {children}
                        </ErrorBoundary>
                    </ClientProviders>
                </Providers>
                <Toaster />
            </body>
        </html>
    );
}
