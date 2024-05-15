// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import cx from 'clsx';
import { Component, createRef, CSSProperties, ReactPortal, RefObject } from 'react';
import { createPortal } from 'react-dom';

import Clear from './ui/Clear';
import ClickOutside from './ui/ClickOutside';
import Content from './ui/Content';
import Dropdown from './ui/Dropdown';
import DropdownHandle from './ui/DropdownHandle';
import Loading from './ui/Loading';
import Separator from './ui/Separator';
import { debounce, getByPath, getProp, isEqual, valueExistInSelected } from './model/getByPath';

import classes from './ui/classes.module.css';

export interface SelectProps<Element extends Object> {
    helperText?: string;
    fullWidth?: boolean;
    addPlaceholder?: string;
    error?: string;
    additionalProps?: any; // todo
    autoFocus?: boolean;
    backspaceDelete?: boolean;
    className?: string;
    clearAllLabel?: string;
    clearOnBlur?: boolean;
    clearOnSelect?: boolean;
    clearRenderer?: any; // todo
    clearable?: boolean;
    closeOnScroll?: boolean;
    closeOnSelect?: boolean;
    color?: string;
    compareValuesFunc?: any; // todo;
    contentRenderer?: any; // todo;
    create?: boolean;
    createNewLabel?: string;
    debounceDelay?: number;
    direction?: string;
    disabled?: boolean;
    disabledLabel?: string;
    dropdownGap?: number;
    dropdownHandle?: boolean;
    dropdownHandleRenderer?: any; // todo
    dropdownHeight?: string;
    dropdownPosition?: 'top' | 'bottom' | 'auto';
    dropdownRenderer?: any; // todo
    handleKeyDownFn?: any; // todo
    inputRenderer?: any; // todo
    itemRenderer?: any; // todo
    keepOpen?: boolean;
    keepSelectedInList?: boolean;
    labelField?: keyof Element;
    loading?: boolean;
    loadingRenderer?: any; // todo
    multi?: boolean;
    maxItemsToShow?: number;
    name?: string | null;
    noDataLabel?: string;
    noDataRenderer?: any; // todo;
    onChange?: any; // (values: Element[]) => void;
    onClearAll?: any; // todo;;
    onCreateNew?: any; // todo;;
    onDropdownClose?: any; // todo;;
    onDropdownCloseRequest?: any; // todo;
    onDropdownOpen?: any; // todo;
    onSelectAll?: any; // todo;
    optionRenderer?: any; // todo;
    options: any[];
    pattern?: string | undefined;
    placeholder?: string;
    portal?: ReactPortal | null;
    required?: boolean;
    searchBy?: string;
    searchFn?: any; // todo;
    searchable?: boolean;
    selectAll?: boolean;
    selectAllLabel?: string;
    separator?: boolean;
    separatorRenderer?: any; // todo
    sortBy?: keyof Element;
    style?: CSSProperties;
    valueField?: keyof Element;
    values?: Element[];
}

interface SelectState<Element extends Object> {
    dropdown: boolean;
    values: Element[];
    search: string;
    selectBounds: any;
    cursor: null;
    searchResults: Element[];
}

interface Methods<Element extends Object> {
    dropDown: (action: 'close', event, force?: boolean) => any | undefined | boolean;
    removeItem: (event, item: Element, close?: boolean) => void;
    getSelectRef: () => any;
    getSelectBounds: () => any;
    areAllSelected: () => boolean;
    setSearch: (event) => void;
    safeString: (string) => any;
    searchResults: () => any;
    clearAll: () => void;
    createNew: (item: Element) => void;
    // activeCursorItem: (activeCursorItem) => void;
    addItem: (item: Element) => void | boolean;
    handleKeyDown: (event) => any;
    selectAll: (valuesList?: Element[]) => void;
    toggleSelectAll: () => void;
    isSelected: (option: Element) => boolean;
    sortBy: () => Element[];
    getInputSize: () => number;
}

class Select<Element extends Object> extends Component<SelectProps<Element>, SelectState<Element>> {
    private readonly methods: Methods<Element>;

    private readonly select: RefObject<HTMLDivElement>;

    private readonly dropdownRoot: HTMLDivElement | boolean;

    constructor(props) {
        super(props);

        // @ts-ignore
        this.state = {
            dropdown: false,
            values: props.values,
            search: '',
            selectBounds: {},
            // @ts-ignore
            // eslint-disable-next-line react/no-unused-state
            cursor: null,
            // @ts-ignore
            // eslint-disable-next-line react/no-unused-state
        };

        this.methods = {
            // activeCursorItem: this.activeCursorItem,
            addItem: this.addItem,
            areAllSelected: this.areAllSelected,
            clearAll: this.clearAll,
            createNew: this.createNew,
            dropDown: this.dropDown,
            getInputSize: this.getInputSize,
            getSelectBounds: this.getSelectBounds,
            getSelectRef: this.getSelectRef,
            handleKeyDown: this.handleKeyDown,
            isSelected: this.isSelected,
            removeItem: this.removeItem,
            safeString: this.safeString,
            searchResults: this.searchResults,
            selectAll: this.selectAll,
            setSearch: this.setSearch,
            sortBy: this.sortBy,
            toggleSelectAll: this.toggleSelectAll,
        };

        this.select = createRef();
        this.dropdownRoot = typeof document !== 'undefined' && document.createElement('div');
    }

    componentDidMount() {
        if (this.props.portal) {
            this.props.portal.appendChild(this.dropdownRoot);
        }
        window.addEventListener('resize', debounce(this.updateSelectBounds));
        window.addEventListener('scroll', debounce(this.onScroll));

        this.dropDown('close');

        if (this.select) {
            this.updateSelectBounds();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (!isEqual(prevProps.values, this.props.values) && isEqual(prevProps.values, prevState.values)) {
            this.setState(
                {
                    values: this.props.values,
                },
                () => {
                    this.updateSelectBounds();
                    if (!this.props.skipControlledOnChange) this.props.onChange(this.state.values);
                },
            );
            this.updateSelectBounds();
        }

        if (prevState.values !== this.state.values && this.state.values !== prevProps.values) {
            this.props.onChange(this.state.values);
            this.updateSelectBounds();
        }

        if (prevState.search !== this.state.search) {
            this.updateSelectBounds();
        }

        if (prevState.values !== this.state.values && this.props.closeOnSelect) {
            this.dropDown('close');
        }

        if (prevProps.multi !== this.props.multi) {
            this.updateSelectBounds();
        }

        if (prevState.dropdown && prevState.dropdown !== this.state.dropdown) {
            this.onDropdownClose();
        }

        if (!prevState.dropdown && prevState.dropdown !== this.state.dropdown) {
            this.props.onDropdownOpen();
        }
    }

    componentWillUnmount() {
        if (this.props.portal) {
            this.props.portal.removeChild(this.dropdownRoot);
        }
        window.removeEventListener('resize', debounce(this.updateSelectBounds, this.props.debounceDelay));
        window.removeEventListener('scroll', debounce(this.onScroll, this.props.debounceDelay));
    }

    onDropdownClose = () => {
        // eslint-disable-next-line react/no-unused-state
        this.setState({ cursor: null });
        this.props.onDropdownClose();
    };

    onScroll = () => {
        if (this.props.closeOnScroll) {
            this.dropDown('close');
        }

        this.updateSelectBounds();
    };

    updateSelectBounds = () =>
        this.select.current &&
        this.setState({
            selectBounds: this.select.current.getBoundingClientRect(),
        });

    getSelectBounds = () => this.state.selectBounds;

    dropDown = (action = 'toggle', event, force = false) => {
        const target = (event && event.target) || (event && event.srcElement);

        if (this.props.onDropdownCloseRequest !== undefined && this.state.dropdown && force === false && action === 'close') {
            return this.props.onDropdownCloseRequest({
                props: this.props,
                methods: this.methods,
                state: this.state,
                close: () => this.dropDown('close', null, true),
            });
        }

        if (
            this.props.portal &&
            !this.props.closeOnScroll &&
            !this.props.closeOnSelect &&
            event &&
            target &&
            target.offsetParent &&
            target.offsetParent.classList.contains('select-dropdown')
        ) {
            return;
        }

        if (this.props.keepOpen) {
            return this.setState({ dropdown: true });
        }

        if (action === 'close' && this.state.dropdown) {
            this.select.current.blur();

            return this.setState({
                dropdown: false,
                // eslint-disable-next-line react/no-access-state-in-setstate
                search: this.props.clearOnBlur ? '' : this.state.search,
            });
        }

        if (action === 'open' && !this.state.dropdown) {
            return this.setState({ dropdown: true });
        }

        if (action === 'toggle') {
            this.select.current.focus();
            // eslint-disable-next-line react/no-access-state-in-setstate
            return this.setState({ dropdown: !this.state.dropdown });
        }

        return false;
    };

    getSelectRef = () => this.select.current;

    addItem = (item) => {
        if (this.props.multi) {
            if (valueExistInSelected(getByPath(item, this.props.valueField), this.state.values, this.props)) {
                return this.removeItem(null, item, false);
            }

            this.setState({
                // eslint-disable-next-line react/no-access-state-in-setstate
                values: [...this.state.values, item],
            });
        } else {
            this.setState({
                values: [item],
                dropdown: false,
            });
        }

        if (this.props.clearOnSelect) {
            this.setState({ search: '' });
        }

        return true;
    };

    removeItem = (event, item, close = false) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
            if (close) this.dropDown('close');
        }

        this.setState({
            // eslint-disable-next-line react/no-access-state-in-setstate
            values: this.state.values?.filter((values) => getByPath(values, this.props.valueField) !== getByPath(item, this.props.valueField) ?? []),
        });
    };

    setSearch = (event) => {
        this.setState({
            // eslint-disable-next-line react/no-unused-state
            cursor: null,
        });

        this.setState({
            search: event.target.value,
        });
    };

    getInputSize = () => {
        if (this.state.search) {
            return this.state.search.length;
        }

        if (this.state.values.length > 0) {
            return this.props.addPlaceholder.length;
        }

        return this.props.placeholder.length;
    };

    toggleSelectAll = () =>
        this.setState({
            // eslint-disable-next-line react/no-access-state-in-setstate
            values: this.state.values.length === 0 ? this.selectAll() : this.clearAll(),
        });

    clearAll = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.props.onClearAll();
        this.setState({
            values: [],
        });
    };

    selectAll = (valuesList = []) => {
        this.props.onSelectAll();
        const values = valuesList.length > 0 ? valuesList : this.props.options.filter((option) => !option.disabled);

        this.setState({ values });
    };

    isSelected = (option) => !!this.state.values.find((value) => getByPath(value, this.props.valueField) === getByPath(option, this.props.valueField));

    areAllSelected = () => this.state.values.length === this.props.options.filter((option) => !option.disabled).length;

    safeString = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    sortBy = () => {
        const { sortBy, options } = this.props;

        if (!sortBy) {
            return options;
        }

        options.sort((a, b) => {
            if (getProp(a, sortBy) < getProp(b, sortBy)) {
                return -1;
            }
            if (getProp(a, sortBy) > getProp(b, sortBy)) {
                return 1;
            }
            return 0;
        });

        return options;
    };

    searchFn = ({ state, methods, props }) => {
        const regexp = new RegExp(methods.safeString(state.search), 'i');
        if (state.search.length < 2 && props.searchable && props.options.length > 500) {
            return null;
        }
        return methods.sortBy().filter((item) => regexp.test(getByPath(item, this.props.searchBy) || getByPath(item, this.props.valueField)));
    };

    searchResults = () => {
        const args = { state: this.state, props: this.props, methods: this.methods };

        return this.props.searchFn(args) || this.searchFn(args);
    };

    activeCursorItem = (activeCursorItem) =>
        this.setState({
            // eslint-disable-next-line react/no-unused-state
            activeCursorItem,
        });

    handleKeyDown = (event) => {
        const args = {
            event,
            state: this.state,
            props: this.props,
            methods: this.methods,
            setState: this.setState.bind(this),
        };

        return this.props.handleKeyDownFn(args) || this.handleKeyDownFn(args);
    };

    handleKeyDownFn = ({ event, state, props, methods, setState }) => {
        const { cursor } = state;
        const escape = event.key === 'Escape';
        const enter = event.key === 'Enter';
        const arrowUp = event.key === 'ArrowUp';
        const arrowDown = event.key === 'ArrowDown';
        const backspace = event.key === 'Backspace';
        const tab = event.key === 'Tab' && !event.shiftKey;
        const shiftTab = event.shiftKey && event.key === 'Tab';

        if (arrowDown && !state.dropdown) {
            event.preventDefault();
            this.dropDown('open');
            return setState({
                cursor: 0,
            });
        }

        if ((arrowDown || (tab && state.dropdown)) && cursor === null) {
            return setState({
                cursor: 0,
            });
        }

        if (arrowUp || arrowDown || (shiftTab && state.dropdown) || (tab && state.dropdown)) {
            event.preventDefault();
        }

        if (escape) {
            this.dropDown('close');
        }

        if (enter) {
            const currentItem = methods.searchResults()[cursor];
            if (currentItem && !currentItem.disabled) {
                if (props.create && valueExistInSelected(state.search, state.values, props)) {
                    return null;
                }

                methods.addItem(currentItem);
            }
        }

        if ((arrowDown || (tab && state.dropdown)) && methods.searchResults().length === cursor) {
            return setState({
                cursor: 0,
            });
        }

        if (arrowDown || (tab && state.dropdown)) {
            setState((prevState) => ({
                cursor: prevState.cursor + 1,
            }));
        }

        if ((arrowUp || (shiftTab && state.dropdown)) && cursor > 0) {
            setState((prevState) => ({
                cursor: prevState.cursor - 1,
            }));
        }

        if ((arrowUp || (shiftTab && state.dropdown)) && cursor === 0) {
            setState({
                cursor: methods.searchResults().length,
            });
        }

        if (backspace && props.multi && props.backspaceDelete && this.getInputSize() === 0) {
            this.setState({
                // eslint-disable-next-line react/no-access-state-in-setstate
                values: this.state.values?.slice(0, -1) ?? [],
            });
        }
    };

    renderDropdown = () =>
        this.props.portal ? (
            createPortal(<Dropdown props={this.props} state={this.state} methods={this.methods} />, this.dropdownRoot)
        ) : (
            <Dropdown props={this.props} state={this.state} methods={this.methods} />
        );

    createNew = (item) => {
        const newValue = {
            [this.props.labelField!]: item,
            [this.props.valueField!]: item,
        };

        this.addItem(newValue);
        this.props.onCreateNew(newValue);
        this.setState({ search: '' });
    };

    close = (event) => this.dropDown('close', event);

    open = (event) => this.dropDown('open', event);

    focus = () => this.select.current?.focus();

    override render() {
        return (
            <>
                <ClickOutside
                    onClickOutside={this.close}
                    // className="w-full"
                >
                    <div
                        onKeyDown={this.handleKeyDown}
                        onClick={this.open}
                        tabIndex={this.props.disabled ? '-1' : '0'}
                        // direction={this.props.direction}
                        style={this.props.style}
                        ref={this.select}
                        className={cx(classes.outlined, classes.root, 'container', this.props.className, {
                            [classes.disabled]: this.props.disabled,
                            error: this.props.error,
                            'w-full': this.props.fullWidth,
                        })}
                        color={this.props.color}
                        {...this.props.additionalProps}
                    >
                        <Content props={this.props} state={this.state} methods={this.methods} />

                        {(this.props.name || this.props.required) && (
                            <input
                                tabIndex={-1}
                                style={{ opacity: 0, width: 0, position: 'absolute' }}
                                name={this.props.name!}
                                required={this.props.required}
                                pattern={this.props.pattern}
                                defaultValue={this.state.values?.map((value) => value[this.props.labelField]).toString() ?? []}
                                disabled={this.props.disabled}
                            />
                        )}

                        {this.props.loading && <Loading props={this.props} />}

                        {this.props.clearable && this.state.values.length ? <Clear props={this.props} state={this.state} methods={this.methods} /> : null}

                        {this.props.separator && <Separator props={this.props} state={this.state} methods={this.methods} />}

                        {this.props.dropdownHandle && <DropdownHandle onClick={this.focus} props={this.props} state={this.state} methods={this.methods} />}

                        {this.state.dropdown && !this.props.disabled && this.renderDropdown()}

                        <style jsx>{`
                            .container {
                                cursor: pointer;
                                //width: 100%;
                            }

                            .container.error {
                                border: 1px solid var(--error);
                            }

                            .container:focus,
                            .container:focus-within {
                                outline: 0;
                            }
                        `}</style>
                    </div>
                </ClickOutside>
                {/*{(this.props.error || this.props.helperText) && (*/}
                {/*    <FormHelperText error={!!this.props.error}>{this.props.error || this.props.helperText}</FormHelperText>*/}
                {/*)}*/}
            </>
        );
    }
}

// @ts-ignore
Select.defaultProps = {
    addPlaceholder: '',
    placeholder: 'Варианты...',
    values: [],
    options: [],
    multi: false,
    disabled: false,
    searchBy: 'name',
    sortBy: null,
    clearable: false,
    searchable: true,
    dropdownHandle: true,
    separator: false,
    keepOpen: undefined,
    noDataLabel: 'Пусто',
    createNewLabel: 'Добавить {search}',
    disabledLabel: 'disabled',
    dropdownGap: 0,
    closeOnScroll: false,
    debounceDelay: 0,
    labelField: 'name',
    valueField: 'id',
    color: '#0074D9',
    keepSelectedInList: true,
    closeOnSelect: false,
    clearOnBlur: true,
    clearOnSelect: true,
    dropdownPosition: 'bottom',
    dropdownHeight: '300px',
    autoFocus: false,
    portal: null,
    create: false,
    name: null,
    error: null,
    required: false,
    pattern: undefined,
    skipControlledOnChange: false,
    onChange: () => undefined,
    onDropdownOpen: () => undefined,
    onDropdownClose: () => undefined,
    onDropdownCloseRequest: undefined,
    onClearAll: () => undefined,
    onSelectAll: () => undefined,
    onCreateNew: () => undefined,
    searchFn: () => undefined,
    handleKeyDownFn: () => undefined,
    additionalProps: null,
    backspaceDelete: true,
    maxItemsToShow: undefined,
    restOptionsLabel: '...еще',
};

export default Select;
