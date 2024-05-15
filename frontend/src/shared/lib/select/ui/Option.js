import cx from 'clsx';
import React from 'react';
import { getByPath } from '../model/getByPath';

const Option = ({ item, props, state, methods }) =>
    item && props.optionRenderer ? (
        props.optionRenderer({ item, props, state, methods })
    ) : (
        <span role="listitem" className={cx('select-option', { disabled: props.disabled })}>
            <span>{getByPath(item, props.labelField)}</span>
            <span className="select-option-remove" onClick={(event) => methods.removeItem(event, item, props.closeOnSelect)}>
                &times;
            </span>
            <style jsx>{`
                .select-option {
                    padding: 0 5px;
                    border-radius: 2px;
                    line-height: 20px;
                    margin: 1px 2px 1px 0;
                    color: hsl(var(--secondary-foreground));
                    font-size: 14px;
                }

                .select-option.disabled {
                    color: hsl(var(--muted-foreground));
                }

                .select-option-remove {
                    cursor: pointer;
                    width: 21px;
                    height: 21px;
                    display: inline-block;
                    text-align: center;
                    margin: 0 -5px 0 0px;
                    border-radius: 0 3px 3px 0;
                    font-size: 16px;
                }

                .select-option-remove:hover {
                    color: tomato;
                }

                .select-option:hover,
                .select-option:hover > span {
                    opacity: 0.9;
                }
            `}</style>
        </span>
    );

export default Option;
