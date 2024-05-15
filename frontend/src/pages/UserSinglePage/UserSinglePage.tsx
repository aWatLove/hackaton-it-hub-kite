'use client';
import { z } from 'zod';
import { useUserByIdQuery } from '@/entities/user/model/queries';
import { useParams } from 'next/navigation';
import { useCurrentUser } from '@/entities/session/model/queries';
import { UserAvatar } from '@/entities/user/ui/UserAvatar';
import { H2, H4, P } from '@/shared/ui/typography';
import { TelegramIcon } from '@/shared/icons/TelegramI';
import Link from 'next/link';
import { emailUrlParse, telegramUrlParse } from '@/shared/lib/urls/withoutTelegram';
import { SettingsIcon } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { EmailIcon } from '@/shared/icons/EmailIcon';
import { useSettings } from '@/shared/states/useSettings';
import { Section } from '@radix-ui/themes';
import { TextHtml } from '@/shared/ui/text-html';
import { ResumeListCurrent } from '@/entities/resume/ui/ResumeList';
import { TeamListAsUserPartial } from '@/entities/team/ui/TeamListAsUserPartial';
import { SubmitHandler, useForm } from 'react-hook-form';
import { UpdateUserSchema, UpdateUserShemaZod } from '@/shared/models/user.model';
import { TextEditorControl } from '@/shared/lib/lexical/lexicalv2/Control';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { useEffect, useMemo } from 'react';
import { Input } from '@/shared/ui/input';
import { toast } from '@/shared/ui/use-toast';
import { changeUserById } from '@/entities/user/model/mutations';
import { zodResolver } from '@hookform/resolvers/zod';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/ui/accordion';
import { CreateResumeForm } from '@/features/manage-resume/ui/create-resume-form';

const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
    });
type ServerSchema = z.infer<typeof UpdateUserShemaZod>;
type ClientSchema = ServerSchema & { file?: File };
const SingleUserView = () => {};

export const UserSinglePage = () => {
    //@ts-ignore
    const { id, ...other } = useParams<{ id: string }>();
    const [settings, setSettings] = useSettings();
    const { data: curUser } = useCurrentUser();
    const { data: user } = useUserByIdQuery(+id! as number);
    const { firstname = '...', teams = [], bio_info = '', link = '', telegram = '', email = '', lastname = '...', username = '...', avatar = '' } = user ?? {};
    const isOwner = curUser && user && user?.id === curUser?.id;
    const methods = useForm<UpdateUserSchema>({
        resolver: zodResolver(UpdateUserShemaZod),
        defaultValues: useMemo(
            () => ({
                ...user,
                email: user?.email ?? '',
                firstname: user?.link ?? '',
                lastname: user?.telegram ?? '',
                avatar: user?.avatar ?? '',
                bio_info: user?.bio_info ?? '',
                link: user?.bio_info ?? '',
                telegram: user?.telegram ?? '',
            }),
            [user, isOwner],
        ),
    });
    const {
        control,
        watch,
        setValue,
        handleSubmit,
        clearErrors,
        reset,
        formState: { defaultValues },
    } = methods;
    const { mutateAsync } = changeUserById();
    const onSubmit: SubmitHandler<UpdateUserSchema> = async (data) => {
        clearErrors();
        //@ts-ignore
        const { username, id, ...other } = data;
        try {
            await mutateAsync({ ...other });
            toast({ description: 'Изменения приняты' });
        } catch (e) {
            toast({ variant: 'destructive', description: 'Ошибка сервера' });
        }
    };
    useEffect(() => {
        reset(user);
        if (!isOwner && settings) setSettings(false);
    }, [curUser, user, isOwner]);

    return (
        <div className="flex flex-col gap-4 min-h-screen w-full md:px-32">
            <div className="flex gap-10 w-full items-center">
                <UserAvatar user={user} size="lgRounded" />
                {settings && isOwner && (
                    <Button onClick={() => setSettings((v) => !v)} style={{ padding: 0 }} variant="icon" className="cursor-pointer text-accent">
                        <SettingsIcon size={30} />
                    </Button>
                )}
                <div className="w-full">
                    <span className="flex flex-col mb-2">
                        <span className="flex justify-between items-center">
                            {!settings && <H2 className="font-bold h-8" style={{ margin: 0, lineClamp: 1 }}>{`${firstname} ${lastname}`}</H2>}
                            {!settings && isOwner && (
                                <Button onClick={() => setSettings((v) => !v)} style={{ padding: 0 }} variant="icon" className="cursor-pointer">
                                    <SettingsIcon size={18} />
                                </Button>
                            )}
                        </span>
                        {!settings && (
                            <span className="flex gap-1 items-center">
                                <P style={{ margin: 0 }} className="underline">{`@${username}`}</P>
                                <P className="flex items-center text-muted-foreground" style={{ margin: 0, marginTop: 2 }}>{`${String.fromCharCode(160)}|`}</P>
                                <P className="text-md" style={{ margin: 0, marginTop: 2 }}>{`id:${user?.id}`}</P>
                            </span>
                        )}
                    </span>

                    {!settings && telegram && (
                        <Link className="hover:text-accent flex gap-1 items-center" href={telegram || ''}>
                            <TelegramIcon />
                            {`${telegramUrlParse(telegram)}`}
                        </Link>
                    )}
                    {!settings && email && (
                        <span className="hover:text-accent flex gap-1 items-center">
                            <EmailIcon className="mt-[2px]" />
                            {`${emailUrlParse(email)}`}
                        </span>
                    )}
                    {!settings && link && (
                        <Link className="line-clamp-1 items-center hover:text-accent/80  flex gap-1" href={link || ''}>
                            <P style={{ fontSize: 20 }} className=" text-background-foregound">
                                @
                            </P>
                            <P style={{ margin: 0, marginTop: 2 }}>{`${link}`}</P>
                        </Link>
                    )}
                </div>
            </div>
            {!settings && (
                <div>
                    {bio_info && (
                        <Section className="border rounded-lg p-4">
                            <H4>Описание</H4>
                            <TextHtml text={bio_info} />
                        </Section>
                    )}
                    {isOwner && (
                        <Accordion type="multiple">
                            <AccordionItem value={'createResume'}>
                                <AccordionTrigger>
                                    <Button variant="link" className="bg-accent text-primary">
                                        Создать резюме
                                    </Button>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <CreateResumeForm />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    )}
                    <ResumeListCurrent header={<H4>Все Резюме</H4>} />
                    <TeamListAsUserPartial canView={!!isOwner} className="mt-4 mb-4" id={+id} />
                </div>
            )}
            <Form {...methods}>
                {settings && (
                    <form className="space-y-2" onSubmit={handleSubmit(onSubmit, (e) => console.log(e))}>
                        <div>
                            <FormField
                                control={control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Фамилия</FormLabel>
                                        <FormControl>
                                            {/*//@ts-ignore*/}
                                            <Input placeholder="Заржавелли" type="text" {...field} />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                                name="lastname"
                            />
                            <FormField
                                control={control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Фамилия</FormLabel>
                                        <FormControl>
                                            {/*//@ts-ignore*/}
                                            <Input placeholder="Георгий" type="text" {...field} />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                                name="firstname"
                            />
                        </div>
                        <FormField
                            control={control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ссылка на картинку</FormLabel>
                                    <FormControl>
                                        {/*//@ts-ignore*/}
                                        <Input placeholder="https://some_iamge.jpg на аватар*Временно" type="text" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                            name="avatar"
                        />
                        <div>
                            <H4 style={{ marginBottom: 4 }}>О себе</H4>
                            <TextEditorControl control={control} name="bio_info" placeholder="всё  с чего-то начинается" />
                        </div>
                        <div className="flex flex-col gap-1 max-w-[400px] w-max-[400px]">
                            <H4>Социальные сети</H4>
                            <FormField
                                control={control}
                                render={({ field }) => (
                                    <FormItem>
                                        <span className="flex gap-2 items-center">
                                            <FormLabel>@</FormLabel>
                                            <FormControl>
                                                {/*@ts-ignore*/}
                                                <Input placeholder="любая ссылка" type="text" {...field} />
                                            </FormControl>
                                        </span>

                                        <FormMessage />
                                    </FormItem>
                                )}
                                name="link"
                            />
                            <FormField
                                control={control}
                                render={({ field }) => (
                                    <FormItem>
                                        <span className="flex gap-2 items-center">
                                            <FormLabel>
                                                <EmailIcon />
                                            </FormLabel>
                                            <FormControl>
                                                {/*@ts-ignore*/}
                                                <Input defaultValue="" placeholder="крутойразраб@mail.com" type="email" {...field} />
                                            </FormControl>
                                        </span>

                                        <FormMessage />
                                    </FormItem>
                                )}
                                name="email"
                            />
                            <FormField
                                control={control}
                                render={({ field }) => (
                                    <FormItem>
                                        <span className="flex gap-2 items-center">
                                            <FormLabel>
                                                <TelegramIcon />
                                            </FormLabel>
                                            <FormControl>
                                                {/*@ts-ignore*/}
                                                <Input placeholder="telegram" type="text" {...field} />
                                            </FormControl>
                                        </span>

                                        <FormMessage />
                                    </FormItem>
                                )}
                                name="telegram"
                            />
                        </div>
                        <div></div>
                        <Button type="submit">Сохранить</Button>
                    </form>
                )}
            </Form>
        </div>
    );
};
