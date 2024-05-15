const Loading = ({ props }) => (props.loadingRenderer ? props.loadingRenderer({ props }) : <div />);

export default Loading;
