import type { CheckboxRootProps } from '@base-ui/react';

import type { FieldWrapperProps } from '../FieldWrapper/FieldWrapper.types';

export type CheckboxFieldProps = Pick<
  CheckboxRootProps,
  'onCheckedChange' | 'value'
> &
  FieldWrapperProps & {
    labelPosition?: 'left' | 'right';
  } & CheckboxBasePropsDef;

export type CheckboxBasePropsDef = CheckboxRootProps & CheckboxBaseIconPropsDef;

export type CheckboxBaseIconPropsDef = Pick<
  CheckboxRootProps,
  'aria-label' | 'checked' | 'disabled' | 'indeterminate'
> & {
  className?: string;
};
