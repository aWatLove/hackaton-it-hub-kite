import { AUTH_DEPEND } from '@/shared/lib/query';

export class ResumeKeys {
    public static getResumesCurrent = () => [AUTH_DEPEND, 'curUser', 'resume'];
}
