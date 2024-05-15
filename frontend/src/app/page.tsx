import { Div } from '@/shared/ui/div';
import { Suspense } from 'react';
import { getQueryClient } from '@/shared/lib/query';
import { EmptyView } from '@/shared/ui/empty-view';

export default function Home() {
    const c = getQueryClient();
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Suspense fallback={<EmptyView emoji={'🪁'} text="" height={'100vh'} />}>
                <Div />
            </Suspense>
        </main>
    );
}
