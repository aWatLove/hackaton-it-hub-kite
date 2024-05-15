import React, { ElementType, ForwardedRef, HTMLAttributes, ReactNode, useState } from 'react';
import { EmptyView, IEmptyView } from '@/shared/ui/empty-view';
import { Spinner } from '@radix-ui/themes';
import { H4 } from '@/shared/ui/typography';
import { Button } from '@/shared/ui/button';

export interface AbstractListProps<Item> extends HTMLAttributes<ElementType> {
    component?: ElementType;
    data: Item[] | undefined;
    renderItem: (item: Item, index: number) => ReactNode | null;
    className?: string;
    isLoading?: boolean;
    emptyViewProps?: IEmptyView;
    disableEmptyView?: boolean;
    label?: string;
    maxItems?: number;
    containerRef?: ForwardedRef<any>;
}

export const AbstractList = <Item,>(props: AbstractListProps<Item>) => {
    const {
        data = [],
        label,
        maxItems,
        renderItem,
        disableEmptyView = false,
        className,
        component: Component = 'div',
        isLoading = false,
        emptyViewProps,
        containerRef,
        ...other
    } = props;
    const [open, setOpen] = useState<boolean>();
    const toggle = () => setOpen((v) => !v);

    if (isLoading) return <Spinner loading />;
    if (!disableEmptyView && !data.length) return <EmptyView {...emptyViewProps} />;

    return (
        <Component {...other} ref={containerRef} className={className}>
            {label ? <H4 className="my-2">{label}</H4> : null}
            {data.slice(0, maxItems && !open ? maxItems : data.length).map(renderItem)}
            {maxItems && data.length > maxItems ? (
                <Button variant="outline" onClick={toggle}>
                    {!open ? 'Больше' : 'Скрыть'}
                </Button>
            ) : null}
        </Component>
    );
};
