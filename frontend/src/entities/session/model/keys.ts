import { AUTH_DEPEND } from '@/shared/lib/query';

export class SessionKeys {
    public static getCurrentUser = () => [AUTH_DEPEND, 'currentUser'];
}
