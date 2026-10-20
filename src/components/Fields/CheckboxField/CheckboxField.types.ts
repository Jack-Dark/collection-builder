import type { CheckboxRootProps } from '@base-ui/react';

import type { FieldWrapperProps } from '../FieldWrapper/FieldWrapper.types';

export type CheckboxFieldProps = Pick<
  CheckboxRootProps,
  'checked' | 'onCheckedChange' | 'indeterminate' | 'value' | 'aria-label'
> &
  FieldWrapperProps & {
    labelPosition?: 'left' | 'right';
  };

export type CheckboxBasePropsDef = CheckboxRootProps & {
  disabled?: boolean;
  indeterminate?: boolean;
};
