import type { FieldControlProps } from '@base-ui/react';
import type { Ref } from 'react';

import type { FieldWrapperProps } from '../FieldWrapper/FieldWrapper.types';

export type InputFieldProps = Pick<
  FieldControlProps,
  | 'autoFocus'
  | 'defaultValue'
  | 'onValueChange'
  | 'placeholder'
  | 'required'
  | 'type'
  | 'value'
> &
  FieldWrapperProps & {
    ref?: Ref<HTMLElement>;
  };
