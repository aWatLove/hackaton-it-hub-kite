'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

export const ProjectDetail = () => {
    // const { data: project, isLoading } = useCurrentProject();
    // if (isLoading) return <EmptyView emoji={'🪁'} text="" height={'100vh'} />;
    return (
        <div className="flex flex-col gap-4">
            {/*<ProjectDetail />*/}
            <Tabs>
                <TabsList className="xs:w-full xs:flex xs:justify-between xs:flex-row" defaultValue="patches">
                    <TabsTrigger value="patches">Обновления</TabsTrigger>
                    <TabsTrigger value="comments">Комментарии</TabsTrigger>
                    <TabsContent value="patches">патчи</TabsContent>
                    <TabsContent value="comments">комсы</TabsContent>
                </TabsList>
            </Tabs>
        </div>
    );
};
