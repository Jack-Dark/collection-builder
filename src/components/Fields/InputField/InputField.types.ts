import type { InputProps } from '@base-ui/react';

import type { FieldWrapperProps } from '../FieldWrapper/FieldWrapper.types';

export type InputFieldProps = Pick<
  InputProps,
  | 'accept'
  | 'autoFocus'
  | 'capture'
  | 'defaultValue'
  | 'multiple'
  | 'onValueChange'
  | 'placeholder'
  | 'required'
  | 'type'
  | 'value'
  | 'ref'
> &
  FieldWrapperProps & {
    onValueChange?: (value: string) => void;
  };
