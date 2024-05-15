import Item from './Item';
import NoData from './NoData';

import { isomorphicWindow, valueExistInSelected } from '../model/isomorphicWindow';

const dropdownPosition = (props, methods) => {
    const DropdownBoundingClientRect = methods.getSelectRef().getBoundingClientRect();
    const dropdownHeight = DropdownBoundingClientRect.bottom + parseInt(props.dropdownHeight, 10) + parseInt(props.dropdownGap, 10);

    if (props.dropdownPosition !== 'auto') {
        return props.dropdownPosition;
    }

    if (dropdownHeight > isomorphicWindow().innerHeight && dropdownHeight > DropdownBoundingClientRect.top) {
        return 'top';
    }

    return 'bottom';
};

const Dropdown = ({ props, state, methods }) => (
    <DropDownContainer
        tabIndex="-1"
        aria-expanded="true"
        role="list"
        dropdownPosition={dropdownPosition(props, methods)}
        selectBounds={state.selectBounds}
        portal={props.portal}
        dropdownGap={props.dropdownGap}
        dropdownHeight={props.dropdownHeight}
        className="select-dropdown"
    >
        {props.dropdownRenderer ? (
            props.dropdownRenderer({ props, state, methods })
        ) : (
            <>
                {props.create && state.search && !valueExistInSelected(state.search, [...state.values, ...props.options], props) && (
                    <AddNew onClick={() => methods.createNew(state.search)}>{props.createNewLabel.replace('{search}', `"${state.search}"`)}</AddNew>
                )}
                {methods.searchResults() && methods.searchResults().length === 0 ? (
                    <NoData state={state} props={props} methods={methods} />
                ) : props.searchable && state.search.length < 3 && props.options.length > 500 ? (
                    ''
                ) : (
                    methods
                        .searchResults()
                        .map((item, itemIndex) => (
                            <Item key={item[props.valueField]} item={item} itemIndex={itemIndex} state={state} props={props} methods={methods} />
                        ))
                )}
            </>
        )}
    </DropDownContainer>
);

const DropDownContainer = ({ children, color, portal, dropdownHeight, dropdownPosition, dropdownGap, selectBounds, ...rest }) => (
    <div {...rest}>
        {children}
        <style jsx>{`
            div:focus {
                outline: none;
            }
            div {
                padding: 0;
                display: flex;
                flex-direction: column;
                border-radius: 4px;
                overflow: auto;
                z-index: 9;
                position: absolute;
                background: hsl(var(--popover));
                box-shadow: var(--shadow-1);
            }
        `}</style>
        <style jsx>{`
            div {
                ${dropdownPosition === 'top' ? `bottom: ${selectBounds.height + 2 + dropdownGap}px` : `top: ${selectBounds.height + 2 + dropdownGap}px`};

                ${portal
                    ? `
            position: fixed;
            ${
                dropdownPosition === 'bottom'
                    ? `top: ${selectBounds.bottom + dropdownGap}px;`
                    : `bottom: ${isomorphicWindow().innerHeight - selectBounds.top + dropdownGap}px;`
            }
            left: ${selectBounds.left}px;`
                    : 'left: 0;'};
                width: ${selectBounds.width}px;
                max-height: ${dropdownHeight};
            }
        `}</style>
    </div>
);

const AddNew = ({ children, color, ...rest }) => (
    <div {...rest}>
        <span>{children}</span>
        <style jsx>{`
            div {
                color: hsl(var(--primary));
                padding: 5px 10px;
                display: flex;
            }
            span {
                overflow: hidden;
                width: 100%;
                text-overflow: ellipsis;
            }
            div:hover {
                background: var(--secondary);
                outline: none;
                cursor: pointer;
            }
        `}</style>
    </div>
);

export default Dropdown;
