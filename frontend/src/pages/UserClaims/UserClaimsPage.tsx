'use client';
import { useClaimsQuery } from '@/entities/claim/model/queries';
import { AbstractList } from '@/shared/ui/abstract-list';
import { ClaimSchema } from '@/shared/models/claim.model';
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card';
import { H4, P } from '@/shared/ui/typography';
import { ProfileAvatar } from '@/shared/ui/avatarInstance';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useCurrentUser } from '@/entities/session/model/queries';
import { CloseIcon } from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/shared/ui/alert-dialog';
import { useRemoveClaimByIdAsUser } from '@/features/manage-claims/models/mutations';
import { useToast } from '@/shared/ui/use-toast';

export const UserClaimItem = ({ claim, href }: { claim: ClaimSchema; href: string }) => {
    const { id, accepted, created_at, resume, team, updated_at } = claim ?? {};
    const date = new Date(updated_at).toLocaleDateString();
    const { mutateAsync: deleteClaim, isPending } = useRemoveClaimByIdAsUser();
    const { toast } = useToast();
    return (
        <Card className={cn('relative hover:bg-card/50')}>
            <CardHeader>
                <span className="w-full flex items-end justify-end">
                    <AlertDialog>
                        <AlertDialogTrigger className="hover:text-destructive cursor-pointer">
                            <CloseIcon />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogTitle>Заявка на вступление будет отменена, вы уверены?</AlertDialogTitle>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Отмена</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={async () => {
                                        try {
                                            await deleteClaim(id);
                                            toast({ description: 'Заявка удалена' });
                                        } catch (e) {
                                            //@ts-ignore
                                            toast({ description: e?.response?.data || 'ошибка сервера' });
                                        }
                                    }}
                                >
                                    Продолжить
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </span>
                <span className="flex flex-row justify-between items-center">
                    <Link href={`/team/${team.id}`} className="hover:opacity-[0.6] flex items-center gap-2">
                        <ProfileAvatar src={team.avatar!} fallbackString={team.name} />
                        <H4 className="font-semibold">{team.name}</H4>
                    </Link>
                    <P style={{ margin: 0 }} className="text-muted-foreground text-sm">
                        {date}
                    </P>
                </span>
            </CardHeader>
            <CardContent>
                <div>
                    <P className="text-muted-foreground">Резюме</P>
                    <Link className="hover:text-accent" href={href}>
                        {resume.title}
                    </Link>
                </div>
            </CardContent>
            <CardFooter className="text-muted-foreground">{accepted ? 'принята' : accepted === false ? 'отказ' : 'в процессе'}</CardFooter>
        </Card>
    );
};
export const UserClaimsPage = () => {
    const { data: user, isLoading: isuserLoading } = useCurrentUser();
    const { data: claims, isLoading, isFetched } = useClaimsQuery(!user);
    return (
        <AbstractList
            isLoading={isLoading || isuserLoading}
            disableEmptyView={isLoading || !isFetched}
            className="flex flex-col gap-4 mt-8 w-full"
            data={claims?.claims}
            renderItem={(item, index) => <UserClaimItem href={`/user/${user?.id}`} key={item.id ?? index} claim={item} />}
        />
    );
};
