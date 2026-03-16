import type { FieldRootProps, FieldControlProps } from '@base-ui/react';

import { Field } from '@base-ui/react';

type InputFieldProps = Pick<
  FieldControlProps,
  | 'value'
  | 'defaultValue'
  | 'required'
  | 'onValueChange'
  | 'placeholder'
  | 'type'
> &
  Pick<
    FieldRootProps,
    | 'name'
    | 'validationMode'
    | 'validationDebounceTime'
    | 'className'
    | 'invalid'
    | 'disabled'
  > & {
    label?: string;
    description?: string;
    error?: string;
  };

export const InputField = (props: InputFieldProps) => {
  const {
    className,
    defaultValue,
    description,
    disabled,
    error,
    invalid,
    label,
    name,
    onValueChange,
    placeholder,
    required,
    type,
    validationDebounceTime,
    validationMode,
    value,
  } = props;

  return (
    <Field.Root
      className={className}
      disabled={disabled}
      invalid={invalid}
      name={name}
      validationDebounceTime={validationDebounceTime}
      validationMode={validationMode}
    >
      <Field.Label>
        {label}
        {required ? <span className="text-red-600">*</span> : undefined}
      </Field.Label>
      <Field.Control
        className="input"
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
      />
      <Field.Description>{description}</Field.Description>
      <Field.Item
      /* Groups individual items in a checkbox group or radio group with a label and description. Renders a <div> element. */
      />
      <Field.Error>{error}</Field.Error>
      <Field.Validity>
        {(props) => {
          // console.log('🚀 ~ Field.Validity ~ props:', props);

          return <p>{error}</p>;
        }}
      </Field.Validity>
    </Field.Root>
  );
};
