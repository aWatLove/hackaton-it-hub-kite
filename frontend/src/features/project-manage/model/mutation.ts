import { getQueryClient, useOptimisticMutation } from '@/shared/lib/query';
import { $api } from '@/shared/lib/axios/instance';
import { CreateProjectChemaServer, Project } from '@/shared/models/project.model';
import { TeamKeys } from '@/entities/team/model/keys';

export const useProjectCreateMutation = () =>
    useOptimisticMutation<Project, unknown, CreateProjectChemaServer>({
        //@ts-ignore
        mutationFn: (data) => $api.post<CreateProjectChemaServer, Project>('api/project', data).then((v) => v.data),
    });
export const invalidateTeam = (id: number | undefined) => getQueryClient().invalidateQueries({ queryKey: TeamKeys.getTeamById(id) });
export const useFollowProject = () => {};
