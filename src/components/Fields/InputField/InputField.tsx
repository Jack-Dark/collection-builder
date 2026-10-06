import { Input } from '@base-ui/react';

import type { InputFieldProps } from './InputField.types';

import { FieldWrapper } from '../FieldWrapper';

export const InputField = (props: InputFieldProps) => {
  const {
    autoFocus,
    className,
    defaultValue,
    description,
    disabled,
    error,
    hideLabel,
    invalid,
    label,
    name,
    onValueChange,
    placeholder,
    ref,
    required,
    triggerOnBlur,
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
      hideLabel={hideLabel}
      invalid={invalid}
      label={label}
      name={name}
      required={required}
      validationDebounceTime={validationDebounceTime}
      validationMode={validationMode}
    >
      <Input
        autoComplete={type === 'password' ? 'off' : undefined}
        autoFocus={autoFocus}
        className="input"
        defaultValue={defaultValue}
        onBlur={(event) => {
          const value = event.target.value;

          onValueChange?.(value);
        }}
        onValueChange={(value) => {
          if (!triggerOnBlur) {
            onValueChange?.(value);
          }
        }}
        placeholder={placeholder}
        ref={ref}
        required={required}
        type={type}
        value={value}
      />
    </FieldWrapper>
  );
};
