import { useOptimisticMutation } from '@/shared/lib/query';
import { $api } from '@/shared/lib/axios/instance';
import { UpdateUserSchema, UserType } from '@/shared/models/user.model';
import { SessionKeys } from '@/entities/session/model/keys';

export const changeUserById = () =>
    useOptimisticMutation<UserType, unknown, UpdateUserSchema>({
        invalidate: SessionKeys.getCurrentUser(),
        mutationFn: (data) => $api.put('api/user', data).then((v) => v.data),
    });
