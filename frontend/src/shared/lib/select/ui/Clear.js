const Clear = ({ props, state, methods }) =>
    props.clearRenderer ? (
        props.clearRenderer({ props, state, methods })
    ) : (
        <div tabIndex="-1" onClick={methods.clearAll} onKeyPress={methods.clearAll}>
            &times;
            <style jsx>{`
                div {
                    z-index: 1;
                    line-height: 25px;
                    margin: 0 10px;
                    cursor: pointer;
                }

                div:focus {
                    outline: none;
                }

                div:hover {
                    color: tomato;
                }
            `}</style>
        </div>
    );

export default Clear;
