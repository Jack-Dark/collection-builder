import { Field } from '@base-ui/react';

import type { TextAreaFieldPropsDef } from './TextAreaField.types';

import { FieldWrapper } from '../FieldWrapper';

export const TextAreaField = (props: TextAreaFieldPropsDef) => {
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
        className="p-1.5 border rounded-xs border-theme-divider-1 dark:border-theme-divider-3 bg-theme-surface-1 dark:bg-theme-surface-2"
        onValueChange={onValueChange}
        placeholder={placeholder}
        ref={ref}
        render={(props) => {
          return <textarea {...props} />;
        }}
        required={required}
        type={type}
        value={value}
      />
    </FieldWrapper>
  );
};
