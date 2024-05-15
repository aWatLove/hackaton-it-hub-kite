const Separator = ({ props, state, methods }) =>
    props.separatorRenderer ? (
        props.separatorRenderer({ props, state, methods })
    ) : (
        <div>
            <style jsx>{`
                div {
                    border-left: var(--border);
                    width: 1px;
                    height: 25px;
                    display: block;
                }
            `}</style>
        </div>
    );

export default Separator;
