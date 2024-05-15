'use client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { CreatePostResumeSchema, CreateResumeZod } from '@/shared/models/resume.model';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { TextEditorControl } from '@/shared/lib/lexical/lexicalv2/Control';
import { Button } from '@/shared/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';
import { useCreateResume } from '@/features/manage-resume/model/mutations';
import { useToast } from '@/shared/ui/use-toast';

export const CreateResumeForm = () => {
    const methods = useForm<CreatePostResumeSchema>({
        resolver: zodResolver(CreateResumeZod),
        defaultValues: { title: '', html_info: '' },
    });
    const { mutateAsync, isPending } = useCreateResume();
    const { handleSubmit, control, reset } = methods;
    const { toast } = useToast();
    const onSubmit: SubmitHandler<CreatePostResumeSchema> = async (data) => {
        try {
            await mutateAsync(data);
            toast({ description: 'Резюме успешно добавлено' });
            reset();
        } catch (e) {
            toast({ description: 'Ошибка сервера', variant: 'destructive' });
        }
    };
    return (
        <Form {...methods}>
            <form onSubmit={handleSubmit(onSubmit, console.log)} className="space-y-8 px-4">
                <FormField
                    control={control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Заголовок резюме</FormLabel>
                            <FormControl>
                                {/*//@ts-ignore*/}
                                <Input placeholder="Заголовок резюме" type="text" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    name="title"
                />
                <FormField
                    render={(field) => (
                        <FormItem>
                            <FormLabel>О себе</FormLabel>
                            <FormControl>
                                <TextEditorControl {...field} name="html_info" control={control} />
                            </FormControl>
                        </FormItem>
                    )}
                    control={control}
                    name="html_info"
                />
                <Button loading={isPending} variant="icon" size="icon" type="submit" className="rounded-full bg-accent">
                    <PlusIcon />
                </Button>
            </form>
        </Form>
    );
};
