import type { FieldControlProps } from '@base-ui/react';
import type { Ref } from 'react';

import type { FieldWrapperProps } from '../FieldWrapper/FieldWrapper.types';

export type InputFieldProps = Pick<
  FieldControlProps,
  | 'autoFocus'
  | 'onValueChange'
  | 'placeholder'
  | 'required'
  | 'type'
  | 'value'
  | 'defaultValue'
> &
  FieldWrapperProps & {
    ref?: Ref<HTMLElement>;
  };
