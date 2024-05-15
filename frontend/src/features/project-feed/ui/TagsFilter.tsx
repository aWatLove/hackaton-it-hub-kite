import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTagsQuery } from '@/entities/tag/model/queries';
import { AbstractList } from '@/shared/ui/abstract-list';
import { cn } from '@/lib/utils';
import classes from './classes.module.css';
import { Badge } from '@/shared/ui/badge';
import queryString from 'query-string';

export const TagsFilter = ({ className }: { className?: string }) => {
    const router = useRouter();
    const pathName = usePathname();
    const params = useSearchParams();
    const { data: { tags = [] } = {} } = useTagsQuery();
    if (!tags?.length) return null;

    const rtags = params?.getAll('tags') ?? [];
    const handleChangeRouter = (id: string | undefined, isActive: boolean) => {
        let news: string[];

        if (isActive) {
            news = rtags.filter((v) => v !== id);
        } else {
            if (!rtags.includes(id!)) {
                console.log({ id });
                //@ts-ignore
                news = [...rtags, id];
            } else {
                news = rtags;
            }
        }
        console.log(news);
        if (pathName) router.push(`${pathName}/?${queryString.stringify({ tags: news })}`);
    };

    return (
        <AbstractList
            disableEmptyView
            data={tags}
            className={cn('flex h-[44px] gap-1 w-[100%] fullWidth items-center', classes.carousel, className)}
            renderItem={(t, key) => {
                const isActive = rtags?.includes(String(t.id));
                return (
                    <Badge
                        variant="outline"
                        className={cn('text-primary cursor-pointer', { 'bg-accent/95': isActive })}
                        // @ts-ignore
                        onClick={() => handleChangeRouter(String(t.id), isActive)}
                        //@ts-ignore
                        key={t.id ?? key}
                        //@ts-ignore
                    >
                        {t.tagname}
                    </Badge>
                );
            }}
        />
    );
};
