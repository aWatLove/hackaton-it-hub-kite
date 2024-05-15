'use client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { UserRegisterFormSchema, UserRegisterSchema } from '@/shared/models/user.model';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Skeleton } from '@/shared/ui/skeleton';
import { useToast } from '@/shared/ui/use-toast';
import { Button } from '@/shared/ui/button';
import { useDeferredValue } from 'react';
import axios from 'axios';
import { CookieService } from '@/shared/lib/cookie/CookieService';
import { SessionRepo } from '@/entities/session/model/repo';
import { setContext } from '@/shared/lib/axios/instance';
import { useRouter } from 'next/navigation';
import { useAuthModal } from '@/entities/session/model/states';
import { setToken } from '@/entities/asfjofak';

type SchemaClient = z.infer<typeof UserRegisterFormSchema>;
type SchemaServer = z.infer<typeof UserRegisterSchema>;
export const RegisterForm = () => {
    const router = useRouter();
    const [_, setOpen] = useAuthModal();
    const methods = useForm<SchemaClient>({
        resolver: zodResolver(UserRegisterFormSchema),
        defaultValues: { username: '', firstname: '', password: '', confirmPassword: '', lastname: '' },
    });
    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;
    const { toast } = useToast();
    const onSubmit: SubmitHandler<SchemaClient> = async (data) => {
        const { confirmPassword, ...signUpData } = data;
        try {
            const { id } = await SessionRepo.signUp(signUpData);
            const { firstname, lastname, ...signInData } = signUpData;
            const { token } = await SessionRepo.signIn(signInData);
            await setToken(token);
            CookieService.set('token', token);
            setContext({ token });
            router.refresh();
            setOpen((v) => !v);
            toast({ variant: 'default', description: 'Регистрация прошла успешна' });
        } catch (e) {
            if (axios.isAxiosError(e)) {
                toast({ variant: 'destructive', description: `Ошибка сервера: ${e?.response?.data.message}` });
            } else {
                throw e;
            }
        }
    };
    const isSubmittingDeffered = useDeferredValue(isSubmitting);
    return (
        <Form {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                <FormField
                    control={control}
                    render={({ field, fieldState, formState }) => (
                        <FormItem>
                            <FormLabel>Логин</FormLabel>
                            <FormControl>
                                <Input placeholder="cocktail" type="text" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    name="username"
                />
                <FormField
                    control={control}
                    render={({ field, fieldState, formState }) => (
                        <FormItem>
                            <FormLabel>Имя</FormLabel>
                            <FormControl>
                                <Input placeholder="Иосиф" type="text" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    name="firstname"
                />
                <FormField
                    control={control}
                    render={({ field, fieldState, formState }) => (
                        <FormItem>
                            <FormLabel>ФИО</FormLabel>
                            <FormControl>
                                <Input placeholder="Иосиф" type="text" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    name="lastname"
                />

                <FormField
                    control={control}
                    render={({ field, fieldState, formState }) => (
                        <FormItem>
                            <FormLabel>Пароль</FormLabel>
                            <FormControl>
                                <Input placeholder="пароль" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    name="password"
                />
                <FormField
                    control={control}
                    render={({ field, fieldState, formState }) => (
                        <FormItem>
                            <FormLabel>Подвердите пароль пароль</FormLabel>
                            <FormControl>
                                <Input placeholder="Пароль ещё раз" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    name="confirmPassword"
                />

                <Button className="w-full" loading={isSubmittingDeffered}>
                    Зарегистрироваться
                </Button>
            </form>
        </Form>
    );
};
export const RegisterFormSkeleton = () => (
    <div className="flex flex-col space-y-8">
        <div>
            <Skeleton className="w-[100px] h-4 rounded-full mb-1" />
            <Skeleton className="w-full h-9 rounded-full" />
        </div>
        <div>
            <Skeleton className="w-[100px] h-4 rounded-full mb-1" />
            <Skeleton className="w-full h-9 rounded-full" />
        </div>
        <div>
            <Skeleton className="w-[100px] h-4 rounded-full mb-1" />
            <Skeleton className="w-full h-9 rounded-full" />
        </div>
        <div>
            <Skeleton className="w-[100px] h-4 rounded-full mb-1" />
            <Skeleton className="w-full h-9 rounded-full" />
        </div>

        <Skeleton className="w-[177px] self-start h-9 rounded-full" />
    </div>
);
