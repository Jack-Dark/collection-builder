import type { PropsWithChildren } from 'react';

import { Field } from '@base-ui/react';

import type { FieldWrapperProps } from './FieldWrapper.types';

/** Wrap fields with this component to provide consistent label, description, and error handling. */
export const FieldWrapper = (props: PropsWithChildren<FieldWrapperProps>) => {
  const {
    children,
    className,
    description,
    disabled,
    error,
    hideLabel,
    invalid,
    label,
    name,
    required,
    validationDebounceTime,
    validationMode,
  } = props;

  return (
    <Field.Root
      aria-label={hideLabel ? label : undefined}
      className={`grid gap-1 ${className || ''}`}
      disabled={disabled}
      invalid={invalid}
      name={name}
      validationDebounceTime={validationDebounceTime}
      validationMode={validationMode}
    >
      {label && !hideLabel && (
        <Field.Label className="cursor-pointer">
          {label}
          {required ? <span className="text-red-600">*</span> : undefined}
        </Field.Label>
      )}

      {children}

      {description && <Field.Description>{description}</Field.Description>}

      {/* Groups individual items in a checkbox group or radio group with a label and description. Renders a <div> element. */}
      {/* <Field.Item /> */}

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </Field.Root>
  );
};
