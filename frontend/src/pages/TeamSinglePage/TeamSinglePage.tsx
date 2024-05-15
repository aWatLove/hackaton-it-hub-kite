'use client';
import { useTeamCurrentQuery } from '@/entities/team/model/queries';
import { useSettings } from '@/shared/states/useSettings';
import { useCurrentUser } from '@/entities/session/model/queries';
import { H3, P } from '@/shared/ui/typography';
import { Button } from '@/shared/ui/button';
import { ProfileAvatar } from '@/shared/ui/avatarInstance';
import { useMemo, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { MemberAsTeamPartialList } from '@/entities/team/ui/TeamMemberPreviewCard';
import { Dialog, DialogContent, DialogTrigger } from '@/shared/ui/dialog';
import { PlusIcon } from '@radix-ui/react-icons';
import { CurrentMemberTableEdit } from '@/features/(members-manage)/ui/MemberTableEdit';
import { ProjectsTeam } from '@/entities/project/ui/ProjectsTeam';
import { UserAvatar } from '@/entities/user/ui/UserAvatar';
import Link from 'next/link';
import classes from './TeamSingePage.module.css';
import { cn } from '@/lib/utils';
import { TextHtml } from '@/shared/ui/text-html';
import { EmptyView } from '@/shared/ui/empty-view';
import { Accordion, AccordionContent, AccordionItem } from '@/shared/ui/accordion';
import { CreateProjectForm } from '@/features/project-manage/ui/CreateProjectForm';
import { ResumeListCurrent } from '@/entities/resume/ui/ResumeList';
import { useAuthModal } from '@/entities/session/model/states';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/shared/ui/alert-dialog';
import { usePostAcceptInTeam } from '@/entities/team/model/mutation';
import { useToast } from '@/shared/ui/use-toast';
import { ClaimsOwnerTeam } from '@/features/manage-claims/ui/ClaimsOwnerTeam';

export const TeamSinglePage = () => {
    const [settings, setSettings] = useSettings();
    const [open, setOpen] = useState<boolean>();
    const { data: team, isLoading } = useTeamCurrentQuery();
    const { data: curUser } = useCurrentUser();
    const { id: userId } = curUser ?? {};
    const [openAuth, setOpenAuth] = useAuthModal();
    const { mutateAsync, isPending } = usePostAcceptInTeam();
    const logged = !!curUser;
    // const { data: d } = useQuery({
    //     queryKey: ['dsds'],
    //     queryFn: () =>
    //         axiosInstanceWithoutBase
    //             .post('api/auth/signin', {
    //                 username: 'vlad',
    //                 password: 'vlad',
    //             })
    //             .then((v) => v.data),
    // });
    // console.log(d);
    const isOwner = curUser && team && team.owner_id === curUser.id;
    const { avatar, name = '...', id, folowers_count = 0, is_folow, members = [], owner_id, projects = [], description } = team ?? {};
    const projectLikes = useMemo(
        () =>
            projects?.reduce((acc, proj) => {
                acc += proj?.likes_count ?? 0;
                return acc;
            }, 0),
        [team],
    );
    const owner = members.find((member) => member.id == owner_id);
    const isMember = isOwner ? true : !!members.find((v) => v.id === curUser?.id);
    const { toast } = useToast();
    return (
        <div className="mt-8 flex flex-col gap-4 min-h-screen w-full md:px-32">
            <div className={cn('flex gap-10 w-full items-center', classes.header)}>
                <ProfileAvatar src={avatar ?? ''} size="lgRounded" />
                <div className="w-full">
                    <span className="flex flex-col mb-2 gap-2 w-full">
                        <span className="flex justify-between items-center gap-4 flex-wrap">
                            <H3 className="text-center font-bold h-8 line-clamp-1 gap-2" style={{ margin: 0, textOverflow: 'ellipsis' }}>{`${name}`}</H3>
                            <span className="flex gap-4">
                                <Button onClick={() => {} /*подписаться*/}>{is_folow ? 'Вы подписаны' : 'Подписаться'}</Button>
                                {/*{isOwner && (*/}
                                {/*    <Button style={{ padding: 0 }} variant="icon" className="cursor-pointer">*/}
                                {/*        <SettingsIcon size={18} />*/}
                                {/*    </Button>*/}
                                {/*)}*/}
                            </span>
                        </span>
                        <div className="flex flex-wrap  items-center justify-between gap-4 w-full">
                            <span className="flex flex-wrap  gap-2 items-center">
                                <P style={{ margin: 0 }} className="flex gap-1 items-center">
                                    <strong className="font-semibold cursor-pointer hover:text-accent">{folowers_count}</strong> подписчиков
                                </P>
                                <P style={{ margin: 0, marginTop: 2 }} className="flex gap-1 items-center">
                                    <strong className="font-semibold cursor-pointer hover:text-accent">{projectLikes || 0}</strong> Лайков
                                </P>
                            </span>
                            {!isOwner ? (
                                <Link
                                    href={`/user/${owner?.id || 100}`}
                                    className="hover:text-accent flex items-center cursor-pointer gap-3 hover:opcity-[0.8]"
                                >
                                    <P>Создатель</P>
                                    {/*//@ts-ignore*/}
                                    <UserAvatar user={owner!} />
                                </Link>
                            ) : (
                                <P>Вы создатель</P>
                            )}
                        </div>
                    </span>
                </div>
            </div>
            <div>
                <Tabs className="xs:w-full" defaultValue="about">
                    <div className="flex flex-col gap-4">
                        <span className="flex justify-between mb-4">
                            <TabsList className="xs:w-full xs:flex xs:justify-between xs:flex-row" defaultValue="projects">
                                <TabsTrigger value="about">О команде</TabsTrigger>
                                <TabsTrigger className="xs:w-full" value="projects">
                                    Проекты
                                </TabsTrigger>
                                {isOwner && <TabsTrigger value="claims">Заявки в команду</TabsTrigger>}
                            </TabsList>
                            {!isOwner && !isMember && (
                                <span>
                                    <Dialog>
                                        <DialogTrigger
                                            onClick={() => {
                                                if (!logged) setOpenAuth(true);
                                            }}
                                        >
                                            <Button variant="link" className="bg-accent text-primary">
                                                Вступить
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <ResumeListCurrent
                                                itemAction={(id) => (
                                                    <AlertDialog>
                                                        <AlertDialogTrigger className="hover:text-destructive cursor-pointer">
                                                            <Button variant="icon" size="icon" type="submit" className="rounded-full bg-accent">
                                                                <PlusIcon />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Подать заяление в команду?</AlertDialogTitle>
                                                                <AlertDialogDescription>Создатель увидит заявку на вступление</AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Отмена</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={async () => {
                                                                        try {
                                                                            await mutateAsync({
                                                                                team_id: team.id,
                                                                                resume_id: id,
                                                                            });
                                                                            toast({ description: 'Заявка создана' });
                                                                        } catch (e) {
                                                                            toast({
                                                                                description: e.response.data.message || 'ошибка сервера',
                                                                                variant: 'destructive',
                                                                            });
                                                                        }
                                                                    }}
                                                                >
                                                                    Да
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                )}
                                            />
                                        </DialogContent>
                                    </Dialog>
                                </span>
                            )}
                            {isOwner && (
                                <Button onClick={() => setOpen((v) => !v)} className="text-primary bg-accent hover:bg-accent/70">
                                    Создать проект
                                </Button>
                            )}
                        </span>
                        {isOwner && (
                            //@ts-ignore
                            <Accordion defaultValue={'createProject'} type="multiple">
                                <AccordionItem value={open ? 'createProject' : ''}>
                                    <AccordionContent>
                                        <CreateProjectForm />
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        )}
                    </div>

                    <TabsContent value="about">
                        <div className="border rounded-lg p-4">
                            <H3 style={{ marginBottom: 5 }}>Описание</H3>
                            {description ? <TextHtml text={description} /> : !isLoading && <EmptyView emoji={'🪁'} text="Тут пока ничего нет" />}
                        </div>
                        <MemberAsTeamPartialList
                            actions={
                                isOwner && (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                style={{ width: 40, height: 40, padding: 0 }}
                                                variant="outline"
                                                className="rounded-full hover:text-primary-foreground"
                                            >
                                                <PlusIcon className="font-semibold w-4 h-4 " style={{ fontWeight: 'bold' }} />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <CurrentMemberTableEdit />
                                        </DialogContent>
                                    </Dialog>
                                )
                            }
                        />
                    </TabsContent>
                    <TabsContent value="projects">
                        <ProjectsTeam />
                    </TabsContent>
                    {isOwner && (
                        <TabsContent value="claims">
                            <ClaimsOwnerTeam id={team.id} />
                        </TabsContent>
                    )}
                </Tabs>
            </div>
        </div>
    );
};
