import { Input } from '@base-ui/react';
import _ from 'lodash';
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
    onBlur,
    onChange,
    onValueChange,
    onValueChangeDebounceMs = 300,
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
          'min-w-20 max-w-full p-1.5 border rounded-xs border-theme-divider-1 dark:border-theme-divider-3 bg-theme-surface-1 dark:bg-theme-surface-2 dialog:dark:bg-theme-surface-1',
          inputClassName,
        )}
        data-input=""
        defaultValue={defaultValue}
        onBlur={onBlur}
        onChange={onChange}
        onValueChange={
          onValueChange
            ? _.debounce(onValueChange, onValueChangeDebounceMs)
            : undefined
        }
        placeholder={placeholder}
        ref={ref}
        required={required}
        type={type}
        value={value}
      />
    </FieldWrapper>
  );
};
