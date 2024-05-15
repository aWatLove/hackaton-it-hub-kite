import { useMutation, useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/shared/lib/axios/instance';
import { z } from 'zod';
import { UserRegisterSchema } from '@/shared/models/user.model';
import { SessionKeys } from '@/entities/session/model/keys';
import { UserRepo } from '@/entities/user/model/repo';

type SchemaServer = z.infer<typeof UserRegisterSchema>;
const useSignUp = () =>
    useMutation<{ id: number }, { message?: string }, SchemaServer>({
        mutationFn: (data) => axiosInstance.post('/signup', data).then((v) => v.data),
    });
const useSignIn = () =>
    useMutation<
        { token: string },
        {
            message?: string;
        },
        Omit<SchemaServer, 'name'>
    >({
        mutationFn: (data) => axiosInstance.post('/signin', data).then((v) => v.data),
    });
export const getCurrentUserQueryOptions = () => ({
    queryFn: async () => {
        return await UserRepo.getCurUser().catch((v) => null);
    },
    queryKey: SessionKeys.getCurrentUser(),
});

export const useCurrentUser = () => {
    return useQuery({
        ...getCurrentUserQueryOptions(),
        refetchOnMount: true,
        refetchInterval: 3 * 1000 * 60 * 60,
        staleTime: 0,
        retry: 1,
    });
};
