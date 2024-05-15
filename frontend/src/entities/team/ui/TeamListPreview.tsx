import { TeamPartialAsUser } from '@/shared/models/team.model';
import { LinkCore } from '@/shared/ui/LinkCore';
import { Badge } from '@/shared/ui/badge';

export const TeamPreviewAsLink = (props: TeamPartialAsUser) => {
    const { id, name, role } = props;
    return (
        <LinkCore href={`/team/${id}`} key={id}>
            <Badge>{name}</Badge>
        </LinkCore>
    );
};
