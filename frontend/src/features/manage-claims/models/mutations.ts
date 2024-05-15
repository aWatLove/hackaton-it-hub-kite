import { useOptimisticMutation } from '@/shared/lib/query';
import { $api } from '@/shared/lib/axios/instance';
import { ClaimKeys } from '@/entities/claim/model/keys';

export const useRemoveClaimByIdAsUser = () =>
    useOptimisticMutation<void, unknown, number>({ invalidate: ClaimKeys.getClaimsUserAuth(), mutationFn: (id) => $api.delete(`api/claim/${id}`) });
export const useConfirmClaimOwner = (id: number) =>
    useOptimisticMutation<void, unknown, number>({ invalidate: ClaimKeys.getClaimsByTeamId(id), mutationFn: () => $api.put(`api/claim/${id}/accept`) });
