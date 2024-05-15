import { useTeamCurrentQuery } from '@/entities/team/model/queries';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Button } from '@/shared/ui/button';
import { UserAvatar } from '@/entities/user/ui/UserAvatar';
import { Input } from '@/shared/ui/input';
import { EditIcon } from '@/shared/icons/EditIcon';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/shared/ui/hover-card';
import Link from 'next/link';
import { P } from '@/shared/ui/typography';
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
import { CloseIcon } from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon';

export const CurrentMemberTableEdit = () => {
    const is_owner = true;
    const { data: team, isLoading } = useTeamCurrentQuery();
    const { members = [] } = team ?? {};
    return (
        <Table>
            <TableCaption>
                <div className="flex gap-4 items-center">
                    <Input placeholder="id пользователя" role="row" />
                    <Button>Добавить участника</Button>
                </div>
            </TableCaption>
            <TableHeader>
                <TableHead>id</TableHead>
                <TableHead>Пользователь</TableHead>
                <TableHead>Роль</TableHead>
                <TableHead>Действия</TableHead>
            </TableHeader>
            <TableBody>
                {members.map(({ id, role, ...other }) => (
                    <TableRow key={id}>
                        <TableCell>{id}</TableCell>
                        <TableCell>
                            <HoverCard>
                                <HoverCardTrigger className="flex gap-3 items-center">
                                    <P>{other.username}</P>
                                    <UserAvatar user={other} size="default" variant="pointer" />
                                </HoverCardTrigger>
                                <HoverCardContent>
                                    <div className="flex justify-between items-center">
                                        <Link className="hover:text-accent underline" href={`/user/${id}`}>
                                            {`@${other.username}`}
                                        </Link>
                                        <Link className="hover:text-accent underline" href={`/user/${id}`}>
                                            Перейти
                                        </Link>
                                    </div>
                                </HoverCardContent>
                            </HoverCard>
                        </TableCell>
                        <TableCell>{role || 'Участник'}</TableCell>
                        <TableCell>
                            <span className="flex items-center gap-2">
                                <EditIcon className="h-4 w-4 hover:text-accent cursor-pointer" />
                                <AlertDialog>
                                    <AlertDialogTrigger className="hover:text-destructive cursor-pointer">
                                        <CloseIcon />
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Вы уверерены?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Это действие нельзя будет изменить, участника снова нужно будет приглашать в команду
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                                            <AlertDialogAction>Продолжить</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </span>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
