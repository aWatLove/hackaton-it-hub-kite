import { Layout } from '@/widgets/Layout';
import { EmptyView } from '@/shared/ui/empty-view';
import { Suspense } from 'react';
import { UserClaimsPage } from '@/pages/UserClaims/UserClaimsPage';

const Home = () => {
    return (
        <Layout className="lg:px-36 md:px-24">
            <Suspense fallback={<EmptyView emoji={'🪁'} text="" height={'100vh'} />}>
                <UserClaimsPage />
            </Suspense>
        </Layout>
    );
};
export default Home;
