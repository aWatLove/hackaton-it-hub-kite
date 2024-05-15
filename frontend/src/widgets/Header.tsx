'use client';
import { ReactNode, Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import { ThemeToggle } from '@/shared/ui/theme';
import { ErrorBoundary } from '@/shared/lib/errorhandling/ErrorBoundary';
import { Skeleton } from '@radix-ui/themes';
import { useAuthModal } from '@/entities/session/model/states';
import { useCurrentUser } from '@/entities/session/model/queries';
import { CurrentUserAvatar } from '@/entities/user/ui/UserAvatar';
import { useDetectIsMobileDevice } from '@/shared/lib/media/context';
import { CurrentUserNav } from '@/entities/user/ui/CurrentUserNav';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';
import { MainIcon } from '@/shared/icons/MainIcon';
import { ClaimsNotic } from '@/features/manage-claims/ui/ClaimsNotic';

const AuthButton = () => {
    'use client';
    const [_, setOpen] = useAuthModal();
    return <Button onClick={() => setOpen((v) => !v)}>Войти</Button>;
};
const AccountWrapper = () => {
    'use client';
    const { data: user, isLoading } = useCurrentUser();

    if (isLoading) return null;
    if (!user?.id) return <AuthButton />;
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
                <Button asChild className="cursor-pointer">
                    <CurrentUserAvatar variant="pointer" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <CurrentUserNav />
            </DropdownMenuContent>
        </DropdownMenu>
    );
    //     : (
    //     <Drawer>
    //         <DrawerTrigger>
    //             <Button asChild className="cursor-pointer">
    //                 <div className="h-10 w-10">
    //                     <CurrentUserAvatar variant="pointer" />
    //                 </div>
    //             </Button>
    //         </DrawerTrigger>
    //         <DrawerContent className="px-4 pt-4">
    //             <UserNavigationMob user={user} />
    //         </DrawerContent>
    //     </Drawer>
    // );
};

export function Header({ actions }: { actions?: ReactNode }) {
    const { isMobile } = useDetectIsMobileDevice();
    const { data: user } = useCurrentUser();
    const logged = !!user;
    return (
        <header className="sticky top-0 z-50 w-full border-border/40 bg-secondary/95 backdrop-blur supports-[backdrop-filter]:bg-secondary/60">
            <div className="px-4 flex h-14 items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button size="icon" className="text-foreground" variant="ghost" asChild>
                        <Link href="/">
                            <MainIcon />
                        </Link>
                    </Button>
                    {!isMobile && (
                        <Button className="hidden" asChild>
                            <Link className="hover:underline" href="/projects">
                                Лента
                            </Link>
                        </Button>
                    )}
                    {!isMobile && (
                        <Button asChild>
                            <Link className="hover:underline" href="/team/feed">
                                Команды
                            </Link>
                        </Button>
                    )}
                    {/*<HeaderNavigation />*/}
                </div>
                <div className="flex flex-row items-center gap-2">
                    {actions}
                    {logged && (
                        <Link href={`/user/${user.id}/claims`} className="relative hover:text-accent">
                            <ClaimsNotic />
                        </Link>
                    )}
                    <ThemeToggle />
                    <ErrorBoundary>
                        <Suspense fallback={<Skeleton className="rounded-full h-10 w-10" />}>
                            <AccountWrapper />
                        </Suspense>
                    </ErrorBoundary>
                </div>
            </div>
        </header>
    );
}
