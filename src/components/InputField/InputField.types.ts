import type { FieldControlProps } from '@base-ui/react';

import type { FieldWrapperProps } from '../FieldWrapper/FieldWrapper.types';

export type InputFieldProps = Pick<
  FieldControlProps,
  | 'defaultValue'
  | 'onValueChange'
  | 'placeholder'
  | 'required'
  | 'type'
  | 'value'
> &
  FieldWrapperProps;
