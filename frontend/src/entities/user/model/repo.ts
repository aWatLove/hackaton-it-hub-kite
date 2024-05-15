import { $api } from '@/shared/lib/axios/instance';
import { UpdateUserSchema, UserPartialSchema, UserType } from '@/shared/models/user.model';

export class UserRepo {
    //get
    public static getCurUser = async () => $api.get<UserType>('api/user/cur').then((v) => v.data);
    public static getUserById = async (id: number) => $api.get<UserType>(`api/user/${id}`).then((v) => v.data);
    public static getAllUser = async () => $api.get<UserPartialSchema>(`api/user`).then((v) => v.data);
    //@ts-ignore
    public static changeCurrentUser = async () => $api.put<UpdateUserSchema, UserType>('api/user').then((v) => v.data);
}
