import { TagsSchema } from '@/shared/models/tags.model';
import { z } from 'zod';

export type ProjectTeam = {
    id: number;
    name: string;
    avatar?: string | null;
};
export type Project = {
    id: number;
    team: ProjectTeam;
    title: string;
    description?: string;
    likes_count: number;
    folowers_count: number;
    created_at: string;
    updated_at: string;
    patch_count: number;
    is_folow: boolean;
    html_info?: string | null;
    is_liked: boolean;
    tags: Array<TagsSchema>;
};
export type ProjectListSchema = {
    projects: Array<Project>;
};
export const CreateProjectZodChema = z.object({
    title: z.string({ message: 'Обязательное поле' }).min(2, { message: 'хотябы 2 символа' }).max(30, { message: 'лимит в 30 символов' }),
    description: z.string().min(3, { message: '3 символов минимум' }).max(60, { message: '60 символов - лимит' }),
    html_info: z.string().min(20, { message: '20 сиволов минимум' }).max(4000).optional(),
    stack: z.string().min(2, { message: 'обязательно' }).max(40, { message: 'уложитеь в 40 символов' }),
    tags: z.any(),
});
export type CreateProjectChemaServer = z.infer<typeof CreateProjectZodChema>;
