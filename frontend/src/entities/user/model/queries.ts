import { useQuery } from '@tanstack/react-query';
import { UsersKeys } from '@/entities/user/model/keys';
import { UserRepo } from '@/entities/user/model/repo';

export const useUserByIdQuery = (id: number | undefined) => {
    return useQuery({
        refetchOnMount: true,
        refetchIntervalInBackground: true,
        enabled: !!id || id === 0,
        queryKey: UsersKeys.getUserById(id),
        staleTime: 0,
        queryFn: async () => {
            //@ts-ignore
            return await UserRepo.getUserById(id);
        },
    });
};
