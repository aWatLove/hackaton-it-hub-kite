import { z } from 'zod';

export type TeamPartialAsUser = {
    id: number;
    name: string;
    role?: string | null;
    avatar?: string | null;
};
export type MemberTeam = {
    id: number;
    username: string;
    avatar?: string | null;
    role?: string | null;
};
export type ProjectAsTeam = {
    id: number;
    title: string;
    description?: string;
    created_at: string;
    likes_count: number;
    folowers_count: number;
    patch_count: number;
};

export type TeamDetail = {
    id: number;
    description?: string | null;
    name: string;
    folowers_count?: number;
    avatar?: string;
    owner_id: number;
    is_folow?: boolean;
    members?: Array<MemberTeam>;
    projects: Array<ProjectAsTeam>;
};
export const TeamCreateSchemaZod = z.object({
    description: z.string().min(20, { message: 'хотя бы 20 символов' }),
    avatar: z.string().optional(),
    name: z.string().min(1, { message: 'обязательное поле' }).max(30, { message: 'уложитесь в 30 символов' }),
});
export type TeamCreateSchema = z.infer<typeof TeamCreateSchemaZod>;
