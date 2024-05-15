import { Controller, ControllerProps, FieldPath, FieldValues } from 'react-hook-form';

import Select, { SelectProps } from './dynamic';

type SelectControlProps<
    Element extends Record<string, unknown>,
    TFieldValues extends FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<SelectProps<Element>, 'required'> & Omit<ControllerProps<TFieldValues, TName>, 'render'>;

export const SelectControl = <
    Element extends Record<string, unknown>,
    TFieldValues extends FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
    props: SelectControlProps<Element, TFieldValues, TName>,
) => {
    const { control, name, rules, onChange: handleChange, disabled, ...rest } = props;

    return (
        <Controller
            disabled={disabled}
            name={name}
            rules={rules}
            control={control}
            render={({ field, fieldState: { error } }) => {
                const { onChange: onFormChange, value, ...restField } = field;

                const onChange = (values: Element[]) => {
                    onFormChange(values);

                    if (handleChange) {
                        handleChange(values);
                    }
                };

                // @ts-ignore
                return <Select {...rest} {...restField} values={value} onChange={onChange} error={error?.message} required={!!rules?.required} />;
            }}
        />
    );
};
