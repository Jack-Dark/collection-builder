import { Field } from '@base-ui/react';

import type { InputFieldProps } from './InputField.types';

import { FieldWrapper } from '../FieldWrapper';

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
    <FieldWrapper
      className={className}
      description={description}
      disabled={disabled}
      error={error}
      invalid={invalid}
      label={label}
      name={name}
      required={required}
      validationDebounceTime={validationDebounceTime}
      validationMode={validationMode}
    >
      <Field.Control
        className="input"
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
      />
    </FieldWrapper>
  );
};
