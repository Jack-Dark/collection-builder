import type { PropsWithChildren } from 'react';

import { Field } from '@base-ui/react';
import { useMemo } from 'react';

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
    Label,
    name,
    required,
    validationDebounceTime,
    validationMode,
  } = props;

  const errorMessage = useMemo(() => {
    if (error) {
      return typeof error === 'string'
        ? error
        : error
            .map(({ message }) => {
              return message;
            })
            .join('\n');
    }
  }, [error]);

  const isLabelString = typeof Label === 'string';

  return (
    <Field.Root
      aria-label={hideLabel && isLabelString ? Label : undefined}
      className={`max-w-full grid gap-1 ${className || ''}`}
      disabled={disabled}
      invalid={invalid}
      name={name}
      validationDebounceTime={validationDebounceTime}
      validationMode={validationMode}
    >
      {Label && !hideLabel && (
        <Field.Label className="cursor-pointer">
          {isLabelString ? Label : <Label />}
          {required ? <span className="text-red-600">*</span> : undefined}
        </Field.Label>
      )}

      {children}

      {description && <Field.Description>{description}</Field.Description>}

      {/* Groups individual items in a checkbox group or radio group with a label and description. Renders a <div> element. */}
      {/* <Field.Item /> */}

      {errorMessage && <p className="text-red-500 text-xs">{errorMessage}</p>}
    </Field.Root>
  );
};
