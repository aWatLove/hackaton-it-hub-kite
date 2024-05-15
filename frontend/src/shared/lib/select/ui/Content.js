import Input from './Input';
import Option from './Option';
import { getByPath } from '@/shared/lib/select/model/getByPath';

const Content = ({ props, state, methods }) => (
    <div
        onClick={(event) => {
            event.stopPropagation();
            methods.dropDown('open');
        }}
    >
        {props.contentRenderer ? (
            props.contentRenderer({ props, state, methods })
        ) : (
            <>
                {props.multi
                    ? state.values &&
                      state.values.map((item) => (
                          <Option
                              key={`${getByPath(item, props.valueField)}${getByPath(item, props.labelField)}`}
                              item={item}
                              state={state}
                              props={props}
                              methods={methods}
                          />
                      ))
                    : state.values && state.values.length > 0 && <span>{getByPath(state.values[0], props.labelField)}</span>}
                <Input props={props} methods={methods} state={state} />
            </>
        )}

        <style jsx>{`
            div {
                align-items: center;
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                box-sizing: border-box;
                z-index: 1;
                padding: 9px 2px 11px;
            }
            small {
                padding-right: 6px;
            }
        `}</style>
    </div>
);

export default Content;
