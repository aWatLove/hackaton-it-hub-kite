import { ComponentType, forwardRef, ReactNode } from 'react';
import NextLink, { LinkProps } from 'next/link';

export const LinkCore = forwardRef<
    any,
    {
        component?: ComponentType;
        linkProps?: LinkProps;
        children: ReactNode;
        href: string;
        scroll?: boolean;
    }
>(({ href, scroll, linkProps = {}, component: ComponentProp, children, ...props }, ref) => {
    const Component = ComponentProp || 'a';
    return (
        <NextLink scroll={scroll} passHref legacyBehavior {...linkProps} href={href}>
            {/* @ts-ignore */}
            <Component ref={ref} component="a" {...props}>
                {children}
            </Component>
        </NextLink>
    );
});
