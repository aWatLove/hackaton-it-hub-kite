'use client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { CreateProjectChemaServer, CreateProjectZodChema, Project } from '@/shared/models/project.model';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';
import { useTeamCurrentQuery } from '@/entities/team/model/queries';
import { SelectControl } from '@/shared/lib/select/select-control';
import { useTagsQuery } from '@/entities/tag/model/queries';
import { invalidateTeam, useProjectCreateMutation } from '@/features/project-manage/model/mutation';
import { useToast } from '@/shared/ui/use-toast';
import { TextEditorControl } from '@/shared/lib/lexical/lexicalv2/Control';

const defaultVALUES = {
    tags: [],
    title: '',
    description: '',
    html_info: '',
    stack: '',
};
export const CreateProjectForm = ({ onSucces }: { onSucces?: (proj: Project) => void }) => {
    const { data: team, isLoading } = useTeamCurrentQuery();
    const { data, isLoading: isLoadingTags } = useTagsQuery();
    const { tags } = data ?? {};
    const { mutateAsync, isPending } = useProjectCreateMutation();
    const methods = useForm<CreateProjectChemaServer>({
        resolver: zodResolver(CreateProjectZodChema),
        defaultValues: { ...defaultVALUES },
    });
    const { control, handleSubmit, clearErrors } = methods;
    const { toast } = useToast();
    const onSubmit: SubmitHandler<CreateProjectChemaServer> = async (data) => {
        try {
            const newProj = await mutateAsync({ ...data, team_id: team?.id, tags: data?.tags?.flatMap?.((v) => v.id) || [] });
            toast({ description: 'Проект создан' });
            //@ts-ignore
            await invalidateTeam(team!.id);
            onSucces?.(newProj);
        } catch (e) {
            toast({ variant: 'destructive', description: 'Ошибка сервера' });
        }
    };
    return (
        <Form {...methods}>
            <form onSubmit={handleSubmit(onSubmit, console.log)} className="space-y-4 px-4 min-h-[600px] h-min-[600px]">
                <FormField
                    control={control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Название проекта</FormLabel>
                            <FormControl>
                                {/*//@ts-ignore*/}
                                <Input placeholder="Введите название" type="text" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    name="title"
                />
                <FormField
                    control={control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Стэк проекта</FormLabel>
                            <FormControl>
                                {/*//@ts-ignore*/}
                                <Input placeholder="Java, Cotlin, JS..." type="text" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    name="stack"
                />
                <FormField
                    control={control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>О проекте кратко</FormLabel>
                            <FormControl>
                                {/*//@ts-ignore*/}
                                <Input placeholder="Пишем код..." type="text" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    name="description"
                />
                <FormField
                    render={(field) => (
                        <FormItem>
                            <FormLabel>Запись</FormLabel>
                            <FormControl>
                                <TextEditorControl {...field} name="html_info" control={control} />
                            </FormControl>
                        </FormItem>
                    )}
                    control={control}
                    name="html_info"
                />
                <SelectControl
                    // disabled={!canDoAction || isLoading}
                    color="textSecondary"
                    multi={true}
                    searchable={false}
                    fullWidth
                    // className={classes.input16}
                    // defaultValue={[availableAuthors[0]]}
                    control={control}
                    placehold="теги"
                    name="tags"
                    valueField="id"
                    labelField="tagname"
                    //@ts-ignore
                    options={tags}
                />

                <Button variant="icon" size="icon" type="submit" className="rounded-full bg-accent">
                    <PlusIcon />
                </Button>
            </form>
        </Form>
    );
};
