import { TeamPartialAsUser } from '@/shared/models/team.model';
import { Skeleton } from '@/shared/ui/skeleton';
import { Card, CardContent } from '@/shared/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { H4, P } from '@/shared/ui/typography';
import { useUserByIdQuery } from '@/entities/user/model/queries';
import { AbstractList } from '@/shared/ui/abstract-list';
import Link from 'next/link';
import { Button } from '@/shared/ui/button';

export const TeamPreviewAsUser = ({ team }: { team: TeamPartialAsUser }) => {
    return (
        <Link href={`/team/${team.id}`}>
            <Card className="w-[145px] max-w-[145px] flex items-center flex-col px-4 py-2 hover-opacity-[0.8] hover:text-accent">
                <CardContent className="flex flex-col items-center p-0">
                    <Avatar className="hover:opacity-[0.7] rounded-lg w-[80px] h-[80px]">
                        <AvatarImage className="rounded-lg" src={team.avatar!} />
                        <AvatarFallback>{team.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <P className="line-clamp-1 overflow-clip hover:text-accent">{team.name}</P>
                    <P className="text-muted-foreground">{team.role}</P>
                </CardContent>
            </Card>
        </Link>
    );
};
export const TeamListAsUserPartial = ({ className, id, canView }: { id: number; className?: string; canView?: boolean }) => {
    const { data: user, isLoading } = useUserByIdQuery(id);
    const { teams = [] } = user ?? {};
    return (
        <div className="mt-4 border rounded-lg p-4">
            <span className="flex items-center justify-between">
                <H4 style={{ marginBottom: 0 }} className="mb-4">
                    В составе
                </H4>
                {canView && (
                    <Button variant="link" className="bg-accent text-primary">
                        <Link href="/team/create">Создать команду</Link>
                    </Button>
                )}
            </span>
            {isLoading && <TeamListAsUserPartialSkeleton />}
            {!isLoading && (
                <AbstractList
                    className="flex flex-row flex-wrap gap-4 mb-4"
                    isLoading={false}
                    disableEmptyView={isLoading}
                    //@ts-ignore
                    data={teams}
                    renderItem={(item, index) => <TeamPreviewAsUser team={item} key={item.id} />}
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
