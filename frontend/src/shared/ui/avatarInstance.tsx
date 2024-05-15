import { cva, VariantProps } from 'class-variance-authority';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { cn } from '@/lib/utils';

const variants = cva('', {
    variants: {
        variant: {
            default: '',
            pointer: 'cursor-pointer',
        },
        size: {
            default: 'h-9 w-9',
            md: 'h-[60px] w-[60px]',
            xl: 'h-[100px] w-[100px] rounded-sm',
            lg: 'h-auto w-auto rounded-lg',
            lgRounded: 'h-[150px] w-[150px] rounded-full',
        },
    },
    defaultVariants: { variant: 'default' },
});
type ProfileAvatarPropsType = { src: string; fallbackString?: string } & VariantProps<typeof variants>;
export const ProfileAvatar = (props: ProfileAvatarPropsType) => {
    const { src, fallbackString, variant, size } = props;
    const validatePath = !src?.startsWith('data') || false;
    const url = validatePath ? src : src;
    return (
        <Avatar className={cn(variants({ variant, size }), '')}>
            <AvatarImage src={url} />
            <AvatarFallback>{!fallbackString ? 'CN' : fallbackString?.slice(0, 2).toUpperCase()} </AvatarFallback>
        </Avatar>
    );
};
