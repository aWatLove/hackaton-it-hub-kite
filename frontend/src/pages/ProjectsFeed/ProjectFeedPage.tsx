'use client';
import { useCurrentProjectFeedQuery } from '@/entities/project/model/queries';
import { AbstractList } from '@/shared/ui/abstract-list';
import { ProjectCardDetailPreview } from '@/entities/project/ui/ProjectCard';
import { TagsFilter } from '@/features/project-feed/ui/TagsFilter';

export const ProjectFeedPage = () => {
    const { data: { projects } = {}, isLoading } = useCurrentProjectFeedQuery();

    return (
        <div className="w-full flex flex-col gap-4">
            <TagsFilter />
            <AbstractList
                className="flex flex-col gap-4 w-full"
                disableEmptyView={isLoading}
                data={projects}
                renderItem={(item) => <ProjectCardDetailPreview project={item} key={item.id} />}
            />
        </div>
    );
};
