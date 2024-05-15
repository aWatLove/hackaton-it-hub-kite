const NoData = ({ props, state, methods }) =>
    props.noDataRenderer ? (
        props.noDataRenderer({ props, state, methods })
    ) : (
        <div>
            {props.noDataLabel}
            <style jsx>{`
                div {
                    padding: 10px;
                    text-align: center;
                    color: hsl(var(--secondary-foreground));
                }
            `}</style>
        </div>
    );

export default NoData;
