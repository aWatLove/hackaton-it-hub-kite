'use client';
import { UserType } from '@/shared/models/user.model';
import { UserAvatar } from '@/entities/user/ui/UserAvatar';
import { Large, P } from '@/shared/ui/typography';
import { useCurrentUser } from '@/entities/session/model/queries';
import Link from 'next/link';
import { TeamPreviewAsLink } from '@/entities/team/ui/TeamListPreview';

export const UserNavigationMob = ({ user }: { user: UserType }) => {
    const { avatar, id, teams = [], username, firstname, lastname, bio_info } = user;
    const url = `/user/${id}`;
    return (
        <div className="p-4 flex gap-2">
            <UserAvatar user={user} />
            <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center gap-2 flex-wrap">
                    <Link href={url} className="hover:text-mutated-foreground underline">
                        {`@${username}`}
                    </Link>
                    <P style={{ margin: 0, marginTop: 2 }}>{`${firstname} ${lastname}`}</P>
                </div>
                <Large className="flex items-start justify-start">Команды:</Large>

                <div className="flex flex-wrap gap-1">{teams?.map((team) => <TeamPreviewAsLink key={team.id} {...team} />)}</div>
            </div>
        </div>
    );
};
export const UserNavCurrent = () => {
    const { data: user } = useCurrentUser();
    return <UserNavigationMob user={user!} />;
};
