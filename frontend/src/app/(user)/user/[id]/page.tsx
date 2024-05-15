import { Layout } from '@/widgets/Layout';
import { UserSinglePage } from '@/pages/UserSinglePage/UserSinglePage';
import { EmptyView } from '@/shared/ui/empty-view';
import { Suspense } from 'react';

const Home = () => {
    return (
        <Layout>
            <Suspense fallback={<EmptyView emoji={'🪁'} text="" height={'100vh'} />}>
                <UserSinglePage />
            </Suspense>
        </Layout>
    );
};
export default Home;
