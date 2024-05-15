'use client';
import { ProjectAsTeam } from '@/shared/models/team.model';
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card';
import { H4, P } from '@/shared/ui/typography';
import { LikeIcon } from '@/shared/icons/LikeIcon';
import { FollowersIcon } from '@/shared/icons/FollowersIcon';
import { TextHtml } from '@/shared/ui/text-html';
import Link from 'next/link';
import { Project } from '@/shared/models/project.model';
import { AbstractList } from '@/shared/ui/abstract-list';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { cn } from '@/lib/utils';
import { ProfileAvatar } from '@/shared/ui/avatarInstance';

export const ProjectCard = ({ project }: { project: ProjectAsTeam }) => {
    const { title, created_at, id, likes_count = 0, folowers_count = 0, patch_count, description } = project;
    const date = new Date(created_at).toLocaleDateString();
    return (
        <Link href={`/project/${id}`}>
            <Card className="relative hover:bg-card/50">
                <CardHeader className="flex flex-row justify-between items-center">
                    <H4 className="font-semibold">{title}</H4>
                    <P style={{ margin: 0 }} className="text-muted-foreground text-sm">
                        {date}
                    </P>
                </CardHeader>
                {description && (
                    <CardContent>
                        <TextHtml shouldShortText lineClamp={4} text={description} />
                    </CardContent>
                )}
                <CardFooter className="flex-grow flex flex-row justify-between">
                    <span className="flex gap-3">
                        <span className="flex items-center gap-1">
                            <LikeIcon className="w-4 h-4" />
                            <P style={{ margin: 0, marginTop: 2 }}>{likes_count}</P>
                        </span>
                        <span className="flex items-center gap-1">
                            <FollowersIcon />
                            <P style={{ margin: 0, marginTop: 2, marginLeft: 2 }}>{folowers_count}</P>
                        </span>
                    </span>
                    <span className="flex items-center">
                        <P className="text-muted-foreground" style={{ margin: 0, marginTop: 2, marginLeft: 2 }}>{`v${patch_count}`}</P>
                    </span>
                </CardFooter>
            </Card>
        </Link>
    );
};
export const ProjectCardDetailPreview = ({ project }: { project: Project }) => {
    const {
        title,
        created_at,
        id,
        likes_count = 0,
        folowers_count = 0,
        patch_count,
        description,
        updated_at,
        team,
        tags,
        is_liked,
        is_folow,
        html_info,
    } = project;
    const date = new Date(updated_at).toLocaleDateString();
    return (
        <Card className="relative hover:bg-card/50">
            <CardHeader className="flex flex-row justify-between items-center">
                <span className="flex gap-2 items-center cur">
                    <Link href={`/team/${team.id}`}>
                        <ProfileAvatar fallbackString={team.name} src={team.avatar!} />
                    </Link>
                    <P style={{ margin: 0 }}>{team.name}</P>
                    <H4 className="font-semibold">{title}</H4>
                </span>
                <P style={{ margin: 0 }} className="text-muted-foreground text-sm">
                    {date}
                </P>
            </CardHeader>
            <Link href={`/project/${id}`}>
                <CardContent className="flex flex-col gap-2">
                    <span className="flex justify-between flex-wrap gap-4 items-center">
                        {description && <TextHtml shouldShortText lineClamp={4} text={description} />}
                        <Button onClick={() => {} /*подписаться*/}>{is_folow ? 'Вы подписаны' : 'Подписаться'}</Button>
                    </span>
                    {html_info && (
                        <div className="border rounded-lg p-2">
                            <TextHtml shouldShortText lineClamp={6} text={html_info} />
                        </div>
                    )}
                </CardContent>
            </Link>
            <CardFooter className="flex-grow flex flex-row justify-between">
                <span className="flex gap-3">
                    <span className="flex items-center gap-1">
                        <LikeIcon className={cn('w-4 h-4', { 'text-accent': is_liked })} />
                        <P style={{ margin: 0, marginTop: 2 }}>{likes_count}</P>
                    </span>
                    <span className="flex items-center gap-1">
                        <FollowersIcon />
                        <P style={{ margin: 0, marginTop: 2, marginLeft: 2 }}>{folowers_count}</P>
                    </span>
                    <span className="flex items-center gap-1">
                        <AbstractList
                            className=""
                            maxItems={5}
                            disableEmptyView={true}
                            data={tags ?? []}
                            renderItem={(tag) => (
                                <Badge className="mr-1" key={tag.id}>
                                    {tag.tagname}
                                </Badge>
                            )}
                        />
                    </span>
                </span>
                <span className="flex items-center">
                    <P className="text-muted-foreground" style={{ margin: 0, marginTop: 2, marginLeft: 2 }}>{`v${patch_count}`}</P>
                </span>
            </CardFooter>
        </Card>
    );
};
export const ProjectCardDetail = ({ project }: { project: Project }) => {
    const {
        title,
        created_at,
        id,
        likes_count = 0,
        folowers_count = 0,
        patch_count,
        description,
        updated_at,
        team,
        tags,
        is_liked,
        is_folow,
        html_info,
    } = project;
    const date = new Date(updated_at).toLocaleDateString();
    return (
        <Card className="relative hover:bg-card/50 w-full">
            <CardHeader className="flex flex-row justify-between items-center">
                <span className="flex gap-2 items-center cur">
                    <Link href={`/team/${team.id}`}>
                        <ProfileAvatar fallbackString={team.name} src={team.avatar!} />
                    </Link>
                    <P style={{ margin: 0 }}>{team.name}</P>
                    <H4 className="font-semibold">{title}</H4>
                </span>
                <P style={{ margin: 0 }} className="text-muted-foreground text-sm">
                    {date}
                </P>
            </CardHeader>
            <Link href={`/project/${id}`}>
                <CardContent className="flex flex-col gap-2">
                    <span className="flex justify-between flex-wrap gap-4 items-center">
                        {description && <TextHtml shouldShortText lineClamp={4} text={description} />}
                        <Button onClick={() => {} /*подписаться*/}>{is_folow ? 'Вы подписаны' : 'Подписаться'}</Button>
                    </span>
                    {html_info && (
                        <div className="border rounded-lg p-2">
                            <TextHtml text={html_info} />
                        </div>
                    )}
                </CardContent>
            </Link>
            <CardFooter className="flex-grow flex flex-row justify-between">
                <span className="flex gap-3">
                    <span className="flex items-center gap-1">
                        <LikeIcon className={cn('w-4 h-4', { 'text-accent': is_liked })} />
                        <P style={{ margin: 0, marginTop: 2 }}>{likes_count}</P>
                    </span>
                    <span className="flex items-center gap-1">
                        <FollowersIcon />
                        <P style={{ margin: 0, marginTop: 2, marginLeft: 2 }}>{folowers_count}</P>
                    </span>
                    <span className="flex items-center gap-1">
                        <AbstractList
                            className=""
                            maxItems={5}
                            disableEmptyView={true}
                            data={tags ?? []}
                            renderItem={(tag) => (
                                <Badge className="mr-1" key={tag.id}>
                                    {tag.tagname}
                                </Badge>
                            )}
                        />
                    </span>
                </span>
                <span className="flex items-center">
                    <P className="text-muted-foreground" style={{ margin: 0, marginTop: 2, marginLeft: 2 }}>{`v${patch_count}`}</P>
                </span>
            </CardFooter>
        </Card>
    );
};
