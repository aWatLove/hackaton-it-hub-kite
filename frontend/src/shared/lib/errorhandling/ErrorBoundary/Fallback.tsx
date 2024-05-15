export const ErrorFallback = ({ error }:{error:{message?:string}}) => (
  <div>
    <h1>Something went wrong!</h1>
    <pre>{error.message}</pre>
    {/*<pre>{componentStack}</pre>*/}
  </div>
);
