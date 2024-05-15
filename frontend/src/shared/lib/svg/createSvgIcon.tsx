import { ElementType, ForwardedRef, forwardRef, HTMLProps, memo, ReactNode } from 'react';

import cx from 'clsx';

import classes from './classes.module.css';

export interface ISVGIcon extends Omit<HTMLProps<SVGElement>, 'ref'> {
    fontSize?: 'default' | 'inherit' | 'large' | 'medium' | 'small';
    component?: ElementType;
    htmlColor?: string;
    titleAccess?: string;
    viewBox?: string;
}

const SvgIcon = (props: ISVGIcon, ref?: ForwardedRef<SVGElement>) => {
    const {
        children,
        className,
        color = 'inherit',
        component: Component = 'svg',
        fontSize = 'default',
        htmlColor,
        titleAccess,
        viewBox = '0 0 24 24',
        ...other
    } = props;

    return (
        // @ts-ignore
        <Component
            className={cx(
                classes.root,
                {
                    [classes[`color-${color}`]]: color !== 'inherit',
                    [classes[`fontSize-${fontSize}`]]: fontSize !== 'default',
                },
                className,
            )}
            focusable="false"
            viewBox={viewBox}
            color={htmlColor}
            aria-hidden={titleAccess ? undefined : true}
            role={titleAccess ? 'img' : undefined}
            ref={ref}
            {...other}
        >
            {children}
            {titleAccess ? <title>{titleAccess}</title> : null}
        </Component>
    );
};

export default forwardRef<SVGElement, ISVGIcon>(SvgIcon);

export const createSvgIcon = (path: ReactNode, _displayName: string, viewBox: string = '0 0 24 24') => {
    const Component = (props: ISVGIcon, ref?: ForwardedRef<SVGElement>) => (
        //@ts-ignore
        <SvgIcon ref={ref} viewBox={viewBox} {...props}>
            {path}
        </SvgIcon>
    );

    return memo(forwardRef(Component));
};

export type CreateSvgIcon = typeof createSvgIcon;
export type SvgIconType = ReturnType<CreateSvgIcon>;
export type SvgIconProps = ISVGIcon;
