import cx from 'clsx';
import { forwardRef, useEffect, useRef } from 'react';
import { getByPath } from '../model/getByPath';

const Item = (ownProps) => {
    const { props, state, methods, item, itemIndex } = ownProps;
    const { cursor } = state;

    const itemRef = useRef();

    useEffect(() => {
        if (cursor === itemIndex) {
            if (itemRef.current) {
                itemRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
            }
        }
    }, [cursor, itemIndex]);

    if (props.itemRenderer) {
        return props.itemRenderer(ownProps);
    }

    if (!props.keepSelectedInList && methods.isSelected(item)) {
        return null;
    }

    return (
        <ItemRenderer
            role="option"
            ref={itemRef}
            aria-selected={methods.isSelected(item)}
            aria-disabled={item.disabled}
            aria-label={getByPath(item, props.labelField)}
            key={`${getByPath(item, props.valueField)}${getByPath(item, props.labelField)}`}
            tabIndex="-1"
            disabled={item.disabled}
            selected={methods.isSelected(item)}
            onClick={item.disabled ? undefined : () => methods.addItem(item)}
            onKeyPress={item.disabled ? undefined : () => methods.addItem(item)}
            itemActive={state.cursor === itemIndex}
        >
            {getByPath(item, props.labelField)}
        </ItemRenderer>
    );
};

const ItemRenderer = forwardRef(({ disabled, selected, itemActive, children, ...rest }, ref) => (
    <span ref={ref} className={cx({ 'item-selected': selected, 'item-active': itemActive, disabled })} {...rest}>
        {children}
        <style jsx>{`
            span {
                margin-bottom: 2px;
                padding: 8px 16px;
                cursor: pointer;
                border-bottom: var(--border);
                z-index: 1;
            }
            span:hover,
            span:focus {
                background: hsl(var(--secondary));
                outline: none;
            }
            .item-active {
                background: hsl(var(--secondary));
            }
            span.item-selected {
                background: hsl(var(--input));
                color: #fff;
                border-bottom: var(--border);
            }
            span.disabled {
                background: hsl(var(--primary));
                color: hsl(var(--muted-foreground));
                cursor: auto;
            }
            span.disabled.item-active {
                background: none;
            }
            span.disabled.item-selected {
                background: var(--primary);
                color: rgba(255, 255, 255, 0.54);
            }
        `}</style>
    </span>
));

export default Item;
