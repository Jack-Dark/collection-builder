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
    invalid,
    label,
    name,
    required,
    validationDebounceTime,
    validationMode,
  } = props;

  return (
    <Field.Root
      className={`grid grid-cols-1 gap-2 ${className}`}
      disabled={disabled}
      invalid={invalid}
      name={name}
      validationDebounceTime={validationDebounceTime}
      validationMode={validationMode}
    >
      {label && (
        <Field.Label className="cursor-pointer">
          {label}
          {required ? <span className="text-red-600">*</span> : undefined}
        </Field.Label>
      )}

      {children}

      <Field.Description>{description}</Field.Description>

      {/* Groups individual items in a checkbox group or radio group with a label and description. Renders a <div> element. */}
      {/* <Field.Item /> */}

      <Field.Error>{error}</Field.Error>

      <Field.Validity>
        {/*
         // TODO - MIGHT BE ABLE TO ACCESS ERROR IN THE PROPS BELOW 
         */}
        {() => {
          return <p>{error}</p>;
        }}
      </Field.Validity>
    </Field.Root>
  );
};
