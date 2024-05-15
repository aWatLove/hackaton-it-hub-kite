import { useQuery } from '@tanstack/react-query';
import { ResumeKeys } from '@/entities/resume/model/keys';
import { $api } from '@/shared/lib/axios/instance';
import { ResumeByUserList } from '@/shared/models/resume.model';

export const useResumeListByUserQuery = () =>
    useQuery({
        queryKey: ResumeKeys.getResumesCurrent(),
        queryFn: () => $api.get<ResumeByUserList>('api/resume').then((v) => v.data),
    });
