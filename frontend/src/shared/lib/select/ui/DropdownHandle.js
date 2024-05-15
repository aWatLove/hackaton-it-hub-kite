const DropdownHandle = ({ props, state, methods }) => (
    <div
        tabIndex="-1"
        onClick={(event) => methods.dropDown(state.dropdown ? 'close' : 'open', event)}
        onKeyPress={(event) => methods.dropDown('toggle', event)}
        onKeyDown={(event) => methods.dropDown('toggle', event)}
        color={props.color}
    >
        {props.dropdownHandleRenderer ? (
            props.dropdownHandleRenderer({ props, state, methods })
        ) : (
            <svg fill="currentColor" viewBox="0 0 40 40">
                <path d="M31 26.4q0 .3-.2.5l-1.1 1.2q-.3.2-.6.2t-.5-.2l-8.7-8.8-8.8 8.8q-.2.2-.5.2t-.5-.2l-1.2-1.2q-.2-.2-.2-.5t.2-.5l10.4-10.4q.3-.2.6-.2t.5.2l10.4 10.4q.2.2.2.5z" />
            </svg>
        )}
        <style jsx>{`
            div svg {
                width: 16px;
                height: 16px;
                color: var(--text-secondary);
                vertical-align: unset;
            }

            div:focus {
                outline: none;
            }

            div:hover path {
                stroke: var(--primary);
            }

            div:focus path {
                stroke: var(--primary);
            }
        `}</style>
        <style jsx>{`
            div {
                text-align: center;
                ${state.dropdown
                    ? `
            pointer-events: all;
            ${props.dropdownHandleRenderer ? 0 : 'transform: rotate(0deg);margin: 0px 0 -3px 5px;'}
            `
                    : `
            pointer-events: none;
            ${props.dropdownHandleRenderer ? 0 : 'margin: 0 0 0 5px;transform: rotate(180deg);'}
            `};
                cursor: pointer;
            }
        `}</style>
    </div>
);

export default DropdownHandle;
