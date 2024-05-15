import { Layout } from '@/widgets/Layout';
import { TeamSinglePage } from '@/pages/TeamSinglePage/TeamSinglePage';
import { Suspense } from 'react';
import { EmptyView } from '@/shared/ui/empty-view';

const Home = () => {
    return (
        <Layout>
            <Suspense fallback={<EmptyView emoji={'🪁'} text="" height={'100vh'} />}>
                <TeamSinglePage />
            </Suspense>
        </Layout>
    );
};
export default Home;
