'use client';
import Link from 'next/link';
import { Card, CardContent } from '@/shared/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { H2, P } from '@/shared/ui/typography';
import { useQuery } from '@tanstack/react-query';
import { $api } from '@/shared/lib/axios/instance';
import { AbstractList } from '@/shared/ui/abstract-list';
import { Button } from '@/shared/ui/button';

type TeamListPreviewItem = {
    id: number;
    name: string;
    avatar: string | null;
    folowers_count: number;
    isFolow: boolean;
};
export const TeamPreviewFeedItem = ({ team }: { team: TeamListPreviewItem }) => {
    const { id, isFolow, folowers_count, avatar, name } = team;
    return (
        <Link href={`/team/${id}`}>
            <Card className="w-[145px] max-w-[145px] flex items-center flex-col px-4 py-2 hover-opacity-[0.8] hover:text-accent">
                <CardContent className="flex flex-col items-center p-0">
                    <Avatar className="hover:opacity-[0.7] rounded-lg w-[80px] h-[80px]">
                        <AvatarImage className="rounded-lg" src={avatar!} />
                        <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <P className="line-clamp-1 overflow-clip hover:text-accent">{name}</P>
                    <P className="text-muted-foreground">Подписчиков:{folowers_count}</P>
                    <Button>
                        <P>{!isFolow ? 'подписаться' : 'отписаться'}</P>
                    </Button>
                </CardContent>
            </Card>
        </Link>
    );
};
export const TeamListPrev = () => {
    'use client';
    const {
        data: { teams } = {},
        isLoading,
        isFetched,
    } = useQuery({ queryFn: () => $api.get<{ teams: TeamListPreviewItem[] }>('api/team').then((v) => v.data), queryKey: ['list', 'teams'] });
    return (
        <div className="flex flex-col gap-4 flex-wrap w-full mt-8">
            <H2>Команды</H2>
            <AbstractList
                className="flex flex-row gap-4 flex-wrap"
                isLoading={isLoading}
                disableEmptyView={isLoading || !isFetched}
                data={teams}
                renderItem={(team, index) => <TeamPreviewFeedItem team={team} key={team.id || index} />}
            />
        </div>
    );
};
