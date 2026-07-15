import { Field } from '@base-ui/react';

import type { InputFieldProps } from './InputField.types';

import { FieldWrapper } from '../FieldWrapper';

export const InputField = (props: InputFieldProps) => {
  const {
    autoFocus,
    className,
    description,
    disabled,
    error,
    invalid,
    label,
    name,
    onValueChange,
    placeholder,
    ref,
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
        autoComplete={type === 'password' ? 'off' : undefined}
        autoFocus={autoFocus}
        className="input"
        onValueChange={onValueChange}
        placeholder={placeholder}
        ref={ref}
        required={required}
        type={type}
        value={value}
      />
    </FieldWrapper>
  );
};
