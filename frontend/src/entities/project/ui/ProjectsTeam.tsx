'use client';

import { AbstractList } from '@/shared/ui/abstract-list';
import { useTeamCurrentQuery } from '@/entities/team/model/queries';
import { ProjectCard } from '@/entities/project/ui/ProjectCard';

export function ProjectsTeam() {
    const { data: team, isLoading } = useTeamCurrentQuery();
    const { projects = [] } = team ?? {};

    return (
        <AbstractList
            className="gap-4 flex flex-col"
            disableEmptyView={isLoading}
            data={projects}
            renderItem={(project, index) => <ProjectCard key={`${project.id}${index}`} project={project} />}
            isLoading={false}
        />
    );
}
