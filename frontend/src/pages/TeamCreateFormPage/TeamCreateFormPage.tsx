'use client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { TeamCreateSchema, TeamCreateSchemaZod } from '@/shared/models/team.model';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { TextEditorControl } from '@/shared/lib/lexical/lexicalv2/Control';
import { H2 } from '@/shared/ui/typography';
import { Button } from '@/shared/ui/button';
import { useCreateTeam } from '@/entities/team/model/mutation';
import { useToast } from '@/shared/ui/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { LucideStepBack } from 'lucide-react';

export const TeamCreateFormPage = () => {
    const methods = useForm<TeamCreateSchema>({
        resolver: zodResolver(TeamCreateSchemaZod),
    });
    const { control, handleSubmit, clearErrors } = methods;
    const { mutateAsync, isPending } = useCreateTeam();
    const { toast } = useToast();
    const router = useRouter();
    const [fetching, setFetching] = useState<boolean>(false);
    const onSubmit: SubmitHandler<TeamCreateSchema> = async (data) => {
        try {
            clearErrors();
            if (fetching) return;
            setFetching(true);
            const newTeam = await mutateAsync(data);
            toast({ description: 'Команда создана' });
            router.push(`/team/${newTeam.id}`);
        } catch (e) {
            setFetching(false);
            toast({ title: 'Ошибка сервера' });
        }
    };
    return (
        <Form {...methods}>
            <form className="md:px-24 w-full space-y-2 mt-4" onSubmit={handleSubmit(onSubmit)}>
                <FormLabel className="flex flex-row items-center">
                    <LucideStepBack onClick={() => router.back()} style={{ marginBottom: 3 }} />
                    <H2>Создание команды</H2>
                </FormLabel>
                <FormField
                    control={control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Название команды*</FormLabel>
                            <FormControl>
                                <Input placeholder="Введите название" type="text" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    name="name"
                />
                <FormField
                    control={control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ссылка на аватар*</FormLabel>
                            <FormControl>
                                <Input placeholder="https://something_url.com*Временно" type="text" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    name="avatar"
                />
                <FormField
                    render={(field) => (
                        <FormItem>
                            <FormLabel>Описание</FormLabel>
                            <FormControl>
                                <TextEditorControl {...field} name="description" control={control} />
                            </FormControl>
                        </FormItem>
                    )}
                    control={control}
                    name="description"
                />
                <Button loading={isPending || fetching} disabled={isPending} className="w-full mt-10" type="submit">
                    Создать
                </Button>
            </form>
        </Form>
    );
};
