import { $api } from '@/shared/lib/axios/instance';
import { SignInUserSchema, SignUpUserSchema, UserType } from '@/shared/models/user.model';

export class SessionRepo {
    //@ts-ignore

    public static signUp = (data: SignUpUserSchema) => $api.post<SignUpUserSchema, UserType>('api/auth/signup', data).then((v) => v.data);
    //@ts-ignore
    public static signIn = (data: SignInUserSchema) => $api.post<SignInUserSchema, SigninResponse>('api/auth/signin', data).then((v) => v.data);
}
export type SigninResponse = {
    token: string;
    type: 'Bearer';
    id: number;
    username: string;
    avatar: null | string;
    firstname: string;
    lastname: string;
    bioInfo: string | null;
    email: null | string;
    telegram: null | string;
    link: null | string;
};
