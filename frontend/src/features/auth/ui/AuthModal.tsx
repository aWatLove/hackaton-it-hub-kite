'use client';
import { useAuthModal } from '@/entities/session/model/states';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/shared/ui/dialog';
import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { RegisterFormSkeleton } from '@/features/auth/ui/RegisterForm';
import { TabsList } from '@radix-ui/react-tabs';
import { Tabs, TabsContent, TabsTrigger } from '@/shared/ui/tabs';
import { AuthFormSkeleton } from '@/features/auth/ui/AuthForm';

const RegisterForm = dynamic(() => import(/*RegisterFOrm*/ './RegisterForm').then(({ RegisterForm }) => ({ default: RegisterForm })), {
    loading: () => <RegisterFormSkeleton />,
});
const AuthForm = dynamic(() => import(/*RegisterFOrm*/ './AuthForm').then(({ AuthForm }) => ({ default: AuthForm })), {
    loading: () => <AuthFormSkeleton />,
});
export const AuthModal = ({ trigger }: { trigger?: ReactNode }) => {
    const [open, setOpen] = useAuthModal();
    if (!open) return null;

    return (
        <Dialog modal open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <Tabs className="w-full" defaultValue="signin">
                    <DialogHeader>
                        <TabsList className="grid m-auto grid-cols-2 bg-muted p-1 rounded-lg">
                            <TabsTrigger value="signin">Войти</TabsTrigger>
                            <TabsTrigger value="signup">Новый аккаунт</TabsTrigger>
                        </TabsList>
                    </DialogHeader>

                    <TabsContent value="signin">
                        <AuthForm />
                    </TabsContent>
                    <TabsContent value="signup">
                        <RegisterForm />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};
