import { Layout } from '@/widgets/Layout';
import { Suspense } from 'react';
import { TeamCreateFormPage } from '@/pages/TeamCreateFormPage/TeamCreateFormPage';
import { EmptyView } from '@/shared/ui/empty-view';

const TeamCreatePage = () => {
    return (
        <Layout>
            <Suspense fallback={<EmptyView emoji={'🪁'} text="" height={'100vh'} />}>
                <TeamCreateFormPage />
            </Suspense>
        </Layout>
    );
};
export default TeamCreatePage;
