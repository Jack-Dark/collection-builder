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
  description?: string;
  error?: string;
  label?: string;
  required?: boolean;
};
