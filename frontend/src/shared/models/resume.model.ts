import { z } from 'zod';

export type PostSchemaResponse = {
    id: number;
    title: string;
    html_info?: string | null;
    email?: string | null;
    telegram?: string | null;
    link: string | null;
};
export type ResumeByUser = {
    id: number;
    user_id: number;
    title: string | null;
    html_info?: string | null;
    email?: string | null;
    'telegram?': string | null;
    link: string | null;
};
export type ResumeByUserList = {
    resumes?: Array<ResumeByUser> | null;
};
export const CreateResumeZod = z.object({
    title: z.string().min(3, { message: 'подумайте над заголовком' }).max(50, { message: 'перебор, лимит - 50 символов' }),
    html_info: z.string().min(20, { message: 'от этого зависит одобрение, подумай лучше' }).max(4000),
});
export type CreatePostResumeSchema = z.infer<typeof CreateResumeZod>;
