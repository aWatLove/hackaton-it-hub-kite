import { Suspense } from 'react';

import { ErrorBoundary } from '@/shared/lib/errorhandling/ErrorBoundary';
import { Layout } from '@/widgets/Layout';
import { EmptyView } from '@/shared/ui/empty-view';
import { ProjectDetail } from '@/pages/ProjectDetail/ProjectDetail';

async function ProjectSinglePage() {
    return (
        <Layout className="lg:px-36 md:px-24  mt-4">
            <Suspense fallback={<EmptyView emoji={'🪁'} text="" height={'100vh'} />}>
                <ErrorBoundary>
                    <ProjectDetail />
                </ErrorBoundary>
            </Suspense>
        </Layout>
    );
}

export default ProjectSinglePage;
