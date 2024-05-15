import { Suspense } from 'react';

import { ErrorBoundary } from '@/shared/lib/errorhandling/ErrorBoundary';
import { Layout } from '@/widgets/Layout';
import { ProjectFeedPage } from '@/pages/ProjectsFeed/ProjectFeedPage';
import { EmptyView } from '@/shared/ui/empty-view';

async function ProjectsPage() {
    //@ts-ignore
    return (
        <Layout className="lg:px-36 md:px-24  mt-4">
            <Suspense fallback={<EmptyView emoji={'🪁'} text="" height={'100vh'} />}>
                <ErrorBoundary>
                    <ProjectFeedPage />
                </ErrorBoundary>
            </Suspense>
        </Layout>
    );
}

export default ProjectsPage;
