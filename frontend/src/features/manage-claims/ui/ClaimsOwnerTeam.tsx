'use client';
import { useClaimsByTeamId } from '@/entities/claim/model/queries';
import { AbstractList } from '@/shared/ui/abstract-list';
import { ClaimSchema } from '@/shared/models/claim.model';
import { useConfirmClaimOwner, useRemoveClaimByIdAsUser } from '@/features/manage-claims/models/mutations';
import { useToast } from '@/shared/ui/use-toast';
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card';
import { cn } from '@/lib/utils';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/shared/ui/alert-dialog';
import { CloseIcon } from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon';
import Link from 'next/link';
import { ProfileAvatar } from '@/shared/ui/avatarInstance';
import { H4, P } from '@/shared/ui/typography';
import { Button } from '@/shared/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';

export const ClamOwnerItem = ({ claim }: { claim: ClaimSchema }) => {
    const { id, accepted, created_at, resume, team, updated_at } = claim ?? {};
    const date = new Date(updated_at).toLocaleDateString();
    const { mutateAsync: deleteClaim, isPending } = useRemoveClaimByIdAsUser();
    const { mutateAsync: confirmClaim, isPending: isConfirmPending } = useConfirmClaimOwner(id);
    const { toast } = useToast();
    return (
        <Card className={cn('relative hover:bg-card/50')}>
            <CardHeader>
                <span className="w-full flex items-end justify-end">
                    <Button
                        className="h-6 w-6"
                        onClick={async () => {
                            try {
                                await confirmClaim(id);
                                toast({ description: 'Заявка принята, ждите гостей' });
                            } catch (e) {
                                //@ts-ignore
                                toast({ description: e?.response?.data || 'ошибка сервера' });
                            }
                        }}
                        variant="icon"
                        size="icon"
                    >
                        <PlusIcon />
                    </Button>
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
                    <P style={{ margin: 0 }} className="hover:text-accent">
                        {resume.title}
                    </P>
                </div>
            </CardContent>
            <CardFooter className="text-muted-foreground">{accepted ? 'принята' : accepted === false ? 'отказ' : 'в процессе'}</CardFooter>
        </Card>
    );
};
export const ClaimsOwnerTeam = ({ id }: { id: number }) => {
    console.log({ id });
    const { data: { claims } = {}, isLoading, isFetched } = useClaimsByTeamId(id);
    return (
        <AbstractList isLoading={isLoading} disableEmptyView={isLoading || !isFetched} data={claims} renderItem={(claim) => <ClamOwnerItem claim={claim} />} />
    );
};
