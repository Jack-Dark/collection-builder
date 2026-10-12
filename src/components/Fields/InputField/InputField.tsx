import { Input } from '@base-ui/react';
import { twMerge } from 'tailwind-merge';

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
    inputClassName,
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
        className={twMerge(
          'input border border-theme-divider-1 dark:border-theme-divider-3 bg-theme-surface-1 dark:bg-theme-surface-2',
          inputClassName,
        )}
        defaultValue={defaultValue}
        onBlur={
          triggerOnBlur
            ? (event) => {
                const value = event.target.value;

                onValueChange?.(value);
              }
            : undefined
        }
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
