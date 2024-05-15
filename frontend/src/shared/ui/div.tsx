'use client';
import { Button } from '@/shared/ui/button';
import { useToast } from '@/shared/ui/use-toast';
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '@/shared/lib/axios/instance';
import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';

const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
    });
export const Div = () => {
    const { toast } = useToast();
    const { mutateAsync } = useMutation({
        mutationFn: () =>
            axiosInstance
                .post(
                    '/signup',
                    {
                        username: 'влад лох',
                        name: 'dsds',
                        password: 'dsds',
                    },
                    {},
                )
                .then((v) => v.data),
    });
    const { mutate, isError } = useMutation({
        mutationFn: async (data: { file: File }) => {
            const formdata = new FormData();
            formdata.append('file', data.file);
            await fetch('/api/upload', { body: formdata, method: 'POST' });
        },
    });

    const inputRef = useRef<HTMLInputElement | null>(null);

    const imageRef = useRef<string>('');
    const fileRef = useRef<File>();
    const [file, setFile] = useState<File | null>(null);
    const image = useMemo(() => {
        return imageRef.current && <Image loading="lazy" width={60} height={60} src={imageRef.current || ''} alt="картинки" />;
    }, [file]);
    return (
        <div>
            <Button
                onClick={async () => {
                    await fetch('/api/signin', { method: 'POST' });
                }}
            >
                тест
            </Button>
            <Button onClick={() => toast({ variant: 'destructive', description: 'Абоба' })} variant="secondary">
                клик
            </Button>
            <Button
                onClick={async () => {
                    const { id } = await mutateAsync().then((data) =>
                        toast({
                            variant: 'destructive',
                            description: data.id,
                        }),
                    );
                }}
                variant="destructive"
            >
                в
            </Button>
            <svg />
            <Button variant="default">клик</Button>
            <Button
                onClick={async () => {
                    // await axios.('/upload', {method:'POST'}).finally(console.log)
                }}
                variant="ghost"
            >
                клик
            </Button>
            <Button
                role="button"
                aria-label="прикрепить картинку поста"
                style={{ borderRadius: '10px', textTransform: 'none' }}
                color="textPrimary"
                onClick={() => inputRef?.current?.click()}
            >
                прикрепить
            </Button>
            <input
                accept="image/*"
                type="file"
                onChange={async (e) => {
                    const file = e?.target?.files?.[0];
                    fileRef.current = file;
                    imageRef.current = await toBase64(file);
                    if (!file) return;
                    setFile(file);
                }}
                multiple={false}
                ref={inputRef}
                id="file"
                style={{ display: 'none' }}
            />
            {image}
            <Button
                onClick={() => {
                    if (file) {
                        mutate({ file: file || fileRef.current });
                    }
                }}
                variant="outline"
            >
                Файл грузи
            </Button>
            <Button variant="link">клик</Button>
        </div>
    );
};
