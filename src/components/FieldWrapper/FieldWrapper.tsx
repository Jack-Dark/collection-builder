import type { PropsWithChildren } from 'react';

import { Field } from '@base-ui/react';

import type { FieldWrapperProps } from './FieldWrapper.types';

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
      {children}
      <Field.Description>{description}</Field.Description>
      <Field.Item />
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
