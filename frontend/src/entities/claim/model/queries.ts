import { useQuery } from '@tanstack/react-query';
import { ClaimKeys } from '@/entities/claim/model/keys';
import { $api } from '@/shared/lib/axios/instance';
import { ClaimUserListSchema } from '@/shared/models/claim.model';

export const useClaimsQuery = (logged?: boolean) =>
    useQuery({
        queryKey: ClaimKeys.getClaimsUserAuth(),
        enabled: !!logged,
        queryFn: () => $api.get<ClaimUserListSchema>('api/claim').then((v) => v.data),
    });
export const useClaimsByTeamId = (teamId: number) =>
    useQuery({
        queryKey: ClaimKeys.getClaimsByTeamId(teamId),
        queryFn: () => $api.get<ClaimUserListSchema>(`api/claim/${teamId}`).then((v) => v.data),
    });
