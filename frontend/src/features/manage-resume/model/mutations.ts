import { useOptimisticMutation } from '@/shared/lib/query';
import { $api } from '@/shared/lib/axios/instance';
import { CreatePostResumeSchema, ResumeByUser } from '@/shared/models/resume.model';
import { SessionKeys } from '@/entities/session/model/keys';
import { ResumeKeys } from '@/entities/resume/model/keys';

export const useCreateResume = () => {
    return useOptimisticMutation<CreatePostResumeSchema, unknown, ResumeByUser>({
        mutationFn: (data) => $api.post('api/resume', data).then((v) => v.data),
        invalidate: [SessionKeys.getCurrentUser(), ResumeKeys.getResumesCurrent()],
    });
};
