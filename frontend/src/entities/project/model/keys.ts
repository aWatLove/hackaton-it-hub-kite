import { AUTH_DEPEND } from '@/shared/lib/query';

export class ProjectKeys {
    public static getProjectsFeed = (tags: string[] | number[] | undefined) =>
        tags?.length ? [AUTH_DEPEND, 'list', 'projects', ...tags] : [AUTH_DEPEND, 'list', 'projects'];
    public static getProjectTeam = (id: number | undefined) => [AUTH_DEPEND, 'team', 'projects', id || -1];
}
