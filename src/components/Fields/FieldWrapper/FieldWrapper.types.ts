import type { FieldRootProps } from '@base-ui/react';
import type { FieldErrors, ValidationIssue } from '@tanstack/react-form';
import type { JSXElementConstructor } from 'react';

export type FieldWrapperProps = Pick<
  FieldRootProps,
  | 'validationMode'
  | 'validationDebounceTime'
  | 'className'
  | 'invalid'
  | 'disabled'
  | 'name'
> & {
  description?: string;
  error?: string | FieldErrors<ValidationIssue>;
  hideLabel?: boolean;
  Label?: string | JSXElementConstructor<{}>;
  required?: boolean;
};
