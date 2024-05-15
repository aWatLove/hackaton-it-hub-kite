'use client';

import { UserType } from '@/shared/models/user.model';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { useCurrentUser } from '@/entities/session/model/queries';
import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { CSSProperties } from 'react';

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
type UserAvatarPropsType = { user?: Pick<UserType, 'username' | 'avatar'> } & VariantProps<typeof variants>;
export const UserAvatar = (props: UserAvatarPropsType) => {
    const { user: { username = '??', avatar = '' } = {}, variant, size } = props;
    return (
        <Avatar className={cn(variants({ variant, size }), '')}>
            <AvatarImage src={avatar} />
            <AvatarFallback>{username.slice(0, 2).toUpperCase()} </AvatarFallback>
        </Avatar>
    );
};
export const ProfileAvatar = (props: UserAvatarPropsType) => {
    const { user: { username = '??', avatar = '' } = {}, variant, size } = props;
    return (
        <Avatar className={cn(variants({ variant, size }), '')}>
            <AvatarImage src={avatar} />
            <AvatarFallback>{username.slice(0, 2).toUpperCase()} </AvatarFallback>
        </Avatar>
    );
};
export const CurrentUserAvatar = (props: Pick<UserAvatarPropsType, 'variant'>) => {
    const { data: user } = useCurrentUser();
    return <UserAvatar user={user!} {...props} />;
};
export const UserAvatarContainer = ({ src, username }: { src: string; username: string }) => {
    const validatePath = !src?.startsWith('data') || false;
    const url = validatePath ? 'http://localhost:3001/avatars/user-[1].png' : src;
    const style = {
        backgroundImage: `url(${url})`,
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%',
        maxWidth: '200px',
        backdropFilter: 'blur(40px)',
        height: '100%',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
    } satisfies CSSProperties;
    return (
        <div className="flex items-center justify-center overflow-hidden rounded-sm relative w-max-[200px] max-w-[200px]">
            <div className="rounded-sm" style={style}></div>
            <img className="h-max-[230px] w-max-[200px] backdrop-blur-lg z-10" style={{ width: 'auto', height: 'auto', margin: '0 auto' }} src={url} />
        </div>
    );
};
