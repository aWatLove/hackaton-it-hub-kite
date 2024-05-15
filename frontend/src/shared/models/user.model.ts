import { z } from 'zod';
import { TeamPartialAsUser } from '@/shared/models/team.model';

export const UserAuthSchema = z.object({
    username: z.string().min(2, { message: 'Слишком короткий ник' }).max(50, { message: 'Ник должен быть меньше или равен 50 символов' }),
    password: z
        .string()
        .min(5, { message: 'Пароль должен быть более длиннее 4 символов' })
        .regex(/^(?=.*[a-zA-Z])(?=.*[!@#$%^&*])/, { message: 'Пароль должен состоять из латинских букв и иметь хотя бы один спец.символ:@$@%&&*' }),
});
export const UserRegisterSchema = UserAuthSchema.extend({
    firstname: z.string().min(2, { message: 'Слишком короткое имя' }).max(50, { message: 'Имя должен быть меньше 50 символов' }),
    lastname: z.string().min(2, { message: 'Слишком короткая фамилия' }).max(50, { message: 'Фамилия должен быть меньше 50 символов' }),
});

export const UserRegisterFormSchema = UserRegisterSchema.extend({
    confirmPassword: z.string().min(5),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
});

export type UserType = {
    id: number;
    username: string;
    avatar?: string;
    firstname: string;
    lastname: string;
    bio_info?: string;
    email?: string;
    telegram?: string;
    link?: string;
    teams?: TeamPartialAsUser[] | null;
};
export const UpdateUserShemaZod = z.object({
    // username: z.string().min(2).max(50),
    avatar: z.string().optional().nullable(),
    firstname: z.string().min(1, { message: 'заполните поле' }).max(50),
    bio_info: z.string().min(20, { message: 'заполните поле' }).max(4000),
    lastname: z.string().min(2, { message: 'заполните поле' }).max(50),
    email: z
        .string()
        .max(50, { message: 'лимит 50 символов' })
        .regex(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            { message: 'невалидный email' },
        )
        .nullable()
        .optional()
        .or(z.literal('')),
    link: z.string().min(5, { message: 'обязательное поле' }).max(50),
    telegram: z.string().min(4, { message: 'обязательное поле' }).max(50),
});
export type UpdateUserSchema = Partial<{
    username: string;
    avatar: string | null;
    firstname: string;
    bio_info: string | null;
    lastname: string;
    email?: string | null;
    telegram?: string | null;
    link?: string | null;
}>;
export type UserPartialSchema = {
    id: number;
    username: string;
    avatar: string;
};
export type SignUpUserSchema = {
    username: string;
    firstname: string;
    lastname: string;
    password: string;
};
export type SignInUserSchema = z.infer<typeof UserAuthSchema>;
