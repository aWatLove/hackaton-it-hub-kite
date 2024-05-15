import { Layout } from '@/widgets/Layout';
import { Suspense } from 'react';
import { EmptyView } from '@/shared/ui/empty-view';
import { TeamListPrev } from '@/entities/team/ui/listPrev';

const TeamsFeedPage = () => {
    return (
        <Layout className="md:px-34 lg:px-36">
            <Suspense fallback={<EmptyView emoji={'🪁'} text="" height={'100vh'} />}>
                <TeamListPrev />
            </Suspense>
        </Layout>
    );
};
export default TeamsFeedPage;
