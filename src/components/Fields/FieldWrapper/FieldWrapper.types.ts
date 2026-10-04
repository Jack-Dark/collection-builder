import type { FieldRootProps } from '@base-ui/react';
import type { FieldErrors, ValidationIssue } from '@tanstack/react-form';

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
  label?: string;
  required?: boolean;
};
