import { useQuery } from '@tanstack/react-query';
import { ProjectKeys } from '@/entities/project/model/keys';
import { Project } from '@/shared/models/project.model';
import { useParams, useSearchParams } from 'next/navigation';
import { $api } from '@/shared/lib/axios/instance';
import queryString from 'query-string';

export const useProjectFeedQuery = (tags?: string[] | undefined | number[]) =>
    useQuery({
        select: (data) => ({ projects: data.projects.sort((proj1, proj2) => +new Date(proj1.updated_at) - +new Date(proj2.updated_at)) }),
        queryKey: ProjectKeys.getProjectsFeed(tags),
        queryFn: () => $api.get<{ projects: Project[] }>(`api/project/?${queryString.stringify({ tags: tags })}`).then((v) => v.data),
    });
export const useCurrentProjectFeedQuery = () => {
    const searchParams = useSearchParams();
    return useProjectFeedQuery(searchParams?.getAll('tags'));
};
export const useCurrentProject = () => {
    //@ts-ignore
    const { id } = useParams<{ id: number }>();
    return useQuery({ queryKey: ProjectKeys.getProjectTeam(id), queryFn: () => $api.get<Project>(`api/project/${id}`).then((v) => v.data) });
};
