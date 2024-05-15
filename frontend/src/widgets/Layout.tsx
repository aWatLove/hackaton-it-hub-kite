import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export const Layout = ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={cn('flex min-h-screen flex-col items-center w-full justify-between px-4 py-2', className)}>{children}</div>
);
