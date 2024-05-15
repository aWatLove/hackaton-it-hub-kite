import { Controller, ControllerProps, FieldPath, FieldValues, RegisterOptions, ValidationValueMessage } from 'react-hook-form';

import { LexicalTextEditor, LexicalTextEditorProps } from './LexicalTextEditor';
import { P } from '@/shared/ui/typography';
import { cn } from '@/lib/utils';

type TextEditorControlProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> = Pick<
    LexicalTextEditorProps,
    'placeholder'
> &
    Omit<ControllerProps<TFieldValues, TName>, 'render' | 'rules'> & { rules?: CustomRules<TFieldValues, TName> };
const getText = (text: string): string => new DOMParser().parseFromString(text, 'text/html').body?.textContent || '';

const resolveCustomRules = <TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(
    customRules?: CustomRules<TFieldValues, TName>,
) => {
    if (!customRules) return customRules;
    let validate: RegisterOptions<TFieldValues, TName>['validate'] = {};

    if (customRules.maxLength && !(typeof customRules.maxLength === 'object' && !customRules.maxLength.value)) {
        const { message, value: maxLength } = customRules.maxLength;

        validate.maxLength = (inputValue) => {
            const text = getText(inputValue);
            const isValid = text.length <= maxLength;

            return isValid || message;
        };
    }

    if (customRules.validate) {
        if (typeof customRules.validate === 'function') {
            validate.validateFunc = customRules.validate;
        } else {
            validate = {
                ...customRules.validate,
                ...validate,
            };
        }
    }

    return { validate };
};

type CustomRules<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> = {
    maxLength?: ValidationValueMessage<number>;
    validate?: RegisterOptions<TFieldValues, TName>['validate'];
};

export const TextEditorControl = <TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(
    props: TextEditorControlProps<TFieldValues, TName>,
) => {
    const { control, name, rules = {}, defaultValue, placeholder } = props;
    return (
        <Controller
            name={name!}
            control={control}
            rules={resolveCustomRules(rules)}
            defaultValue={defaultValue}
            render={({ field, fieldState: { error } }) => (
                <div className="relative">
                    <LexicalTextEditor {...field} defaultValue={field.value} error={error?.message} placeholder={placeholder} />
                    {rules?.maxLength ? (
                        <P className={cn('absolute right-[8px] bottom-0 text-muted-foreground', { ['text-destructive']: error })}>{`${
                            getText(field.value || '').length
                        }/${rules.maxLength.value}`}</P>
                    ) : null}
                </div>
            )}
        />
    );
};
