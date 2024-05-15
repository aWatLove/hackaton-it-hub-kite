import { cloneElement, FC, ReactChild } from 'react';
import { H1, Lead } from '@/shared/ui/typography';

export interface IEmptyView {
    emoji?: string;
    text?: string | ReactChild;
    height?: string | null;
}
export const EmptyView: FC<IEmptyView> = (props) => {
    const { text = 'Нет результатов', emoji = '🐋', height = '40vh' } = props;

    return (
        <div className="flex flex-col items-center justify-center w-full" style={{ height: height || undefined }}>
            <H1 className="mb-1">{emoji}</H1>
            <Lead className="text-muted-foreground">{typeof text === 'function' ? cloneElement(text) : text}</Lead>
        </div>
    );
};
