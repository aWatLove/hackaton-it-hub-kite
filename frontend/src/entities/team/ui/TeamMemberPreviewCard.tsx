import { MemberTeam } from '@/shared/models/team.model';
import Link from 'next/link';
import { Card, CardContent } from '@/shared/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { H4, P } from '@/shared/ui/typography';
import { AbstractList } from '@/shared/ui/abstract-list';
import { Skeleton } from '@/shared/ui/skeleton';
import { useTeamCurrentQuery } from '@/entities/team/model/queries';
import { ReactNode } from 'react';

export const TeamMember = ({ member }: { member: MemberTeam }) => {
    return (
        <Link href={`/user/${member.id}`}>
            <Card className="w-[145px] max-w-[145px] flex items-center flex-col px-4 py-2 hover-opacity-[0.8] hover:text-accent">
                <CardContent className="flex flex-col items-center p-0">
                    <Avatar className="hover:opacity-[0.7] rounded-lg w-[80px] h-[80px]">
                        <AvatarImage className="rounded-lg" src={member.avatar!} />
                        <AvatarFallback>{member.username.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <P className="line-clamp-1 overflow-clip hover:text-accent">{member.username}</P>
                    <P className="text-muted-foreground">{member.role || 'Участник'}</P>
                </CardContent>
            </Card>
        </Link>
    );
};
export const MemberAsTeamPartialList = ({ className, actions }: { className?: string; actions?: ReactNode }) => {
    const { data: team, isLoading } = useTeamCurrentQuery();
    const { members = [] } = team ?? {};
    return (
        <div className="mt-4 border rounded-lg pt-4 px-4">
            <span className="flex justify-between">
                <H4 className="mb-4">Участники команды</H4>
                {actions}
            </span>
            {isLoading && <TeamListAsUserPartialSkeleton />}
            {!isLoading && (
                <AbstractList
                    className="flex flex-row flex-wrap gap-4 mb-4"
                    isLoading={false}
                    disableEmptyView={isLoading}
                    data={members}
                    renderItem={(item, index) => <TeamMember member={item} key={item.id} />}
                />
            )}
        </div>
    );
};

export const TeamListAsUserPartialSkeleton = () => (
    <div className="flex flex-row flex-wrap gap-4 mt-4 mb-4">
        {new Array(4).map((v) => (
            <Card className="w-[145px] max-w-[145px] h-[161px] flex items-center flex-col px-4 py-2">
                <CardContent className="flex flex-col items-center p-0">
                    <Avatar className="rounded-lg w-[80px] h-[80px] mb-3">
                        <AvatarImage className="rounded-lg" src={''} />
                        <AvatarFallback>SN</AvatarFallback>
                    </Avatar>
                    <Skeleton className="w-[60px] h-[20px] mb-1 mt-1" />
                    <Skeleton className="w-[40px] h-[15px]" />
                </CardContent>
            </Card>
        ))}
    </div>
);
