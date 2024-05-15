import { useMutation } from '@tanstack/react-query';
import { $api } from '@/shared/lib/axios/instance';
import { TeamCreateSchema, TeamDetail } from '@/shared/models/team.model';
import { ClaimSchema, CreateClaim } from '@/shared/models/claim.model';

export const useCreateTeam = () =>
    useMutation<TeamDetail, unknown, TeamCreateSchema>({ mutationFn: (data) => $api.post('api/team', data).then((v) => v.data) });
export const usePostAcceptInTeam = () =>
    useMutation<ClaimSchema, unknown, CreateClaim>({ mutationFn: (data) => $api.post('api/claim', data).then((v) => v.data) });
