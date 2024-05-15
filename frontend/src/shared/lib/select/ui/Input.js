import PropTypes from 'prop-types';
import { Component, createRef } from 'react';
import { valueExistInSelected } from '../model/isomorphicWindow';

const handlePlaceHolder = (props, state) => {
    const { addPlaceholder, searchable, placeholder } = props;
    const noValues = state.values && state.values.length === 0;
    const hasValues = state.values && state.values.length > 0;

    if (hasValues && addPlaceholder && searchable) {
        return addPlaceholder;
    }

    if (noValues) {
        return placeholder;
    }

    if (hasValues && !searchable) {
        return '';
    }

    return '';
};

class Input extends Component {
    input = createRef();

    componentDidUpdate(prevProps) {
        if (this.props.state.dropdown || (prevProps.state.dropdown !== this.props.state.dropdown && this.props.state.dropdown) || this.props.props.autoFocus) {
            this.input.current.focus();
        }

        if (prevProps.state.dropdown !== this.props.state.dropdown && !this.props.state.dropdown) {
            this.input.current.blur();
        }
    }

    onBlur = (event) => {
        event.stopPropagation();
        if (!this.props.state.dropdown) {
            return this.input.current.blur();
        }

        return this.input.current.focus();
    };

    handleKeyPress = (event) => {
        const { props, state, methods } = this.props;

        return (
            props.create &&
            event.key === 'Enter' &&
            !valueExistInSelected(state.search, [...state.values, ...props.options], this.props) &&
            state.search &&
            state.cursor === null &&
            methods.createNew(state.search)
        );
    };

    render() {
        const { props, state, methods } = this.props;

        if (props.inputRenderer) {
            return props.inputRenderer({ props, state, methods, inputRef: this.input });
        }

        return (
            <>
                <input
                    ref={this.input}
                    tabIndex="-1"
                    onFocus={(event) => event.stopPropagation()}
                    className={`${!props.searchable && 'read-only'}`}
                    size={methods.getInputSize()}
                    value={state.search}
                    readOnly={!props.searchable}
                    onClick={() => methods.dropDown('open')}
                    onKeyPress={this.handleKeyPress}
                    onChange={methods.setSearch}
                    onBlur={this.onBlur}
                    placeholder={handlePlaceHolder(props, state)}
                    disabled={props.disabled}
                    type={!props.searchable && state.values.length ? 'hidden' : 'text'}
                />
                <style jsx>{`
                    input {
                        flex-grow: 1;
                        max-width: 100%;
                        flex-basis: 0;
                        padding: 2px 0;
                    }

                    input.read-only {
                        cursor: pointer;
                    }
                `}</style>
            </>
        );
    }
}

Input.propTypes = {
    props: PropTypes.object,
    state: PropTypes.object,
    methods: PropTypes.object,
};

export default Input;
