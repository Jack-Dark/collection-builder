import type { InputProps } from '@base-ui/react';

import type { FieldWrapperProps } from '../FieldWrapper/FieldWrapper.types';

export type InputFieldProps = Pick<
  InputProps,
  | 'accept'
  | 'autoFocus'
  | 'capture'
  | 'defaultValue'
  | 'multiple'
  | 'placeholder'
  | 'ref'
  | 'required'
  | 'type'
  | 'value'
> &
  FieldWrapperProps & {
    inputClassName?: string;
    onValueChange?: (value: string) => void;
    triggerOnBlur?: boolean;
  };
