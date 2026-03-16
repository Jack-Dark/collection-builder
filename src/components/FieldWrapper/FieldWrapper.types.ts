import type { FieldRootProps } from '@base-ui/react';

export type FieldWrapperProps = Pick<
  FieldRootProps,
  | 'validationMode'
  | 'validationDebounceTime'
  | 'className'
  | 'invalid'
  | 'disabled'
  | 'name'
> & {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
};
