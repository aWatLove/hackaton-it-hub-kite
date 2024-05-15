import { TeamPartialAsUser } from '@/shared/models/team.model';

export type CreateClaim = {
    resume_id: number;
    team_id: number;
};
export type ResumeAsClaimResponse = {
    id: number;
    title: string;
};
export type ClaimSchema = {
    id: number;
    team: Pick<TeamPartialAsUser, 'id' | 'name' | 'avatar'>;
    resume: ResumeAsClaimResponse;
    created_at: string;
    updated_at: string;
    accepted: Boolean | null;
};
export type ClaimUserListSchema = {
    claims: Array<ClaimSchema>;
};
