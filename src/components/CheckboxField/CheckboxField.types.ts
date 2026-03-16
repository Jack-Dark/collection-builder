import type { CheckboxRootProps } from '@base-ui/react';

import type { FieldWrapperProps } from '../FieldWrapper/FieldWrapper.types';

export type CheckboxFieldProps = Pick<
  CheckboxRootProps,
  'checked' | 'onCheckedChange'
> &
  FieldWrapperProps;
