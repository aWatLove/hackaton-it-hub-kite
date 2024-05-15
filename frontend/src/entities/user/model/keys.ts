import { AUTH_DEPEND } from '@/shared/lib/query';

export class UsersKeys {
    public static getUserById = (id: number | undefined) => [AUTH_DEPEND, 'user', id];
}
