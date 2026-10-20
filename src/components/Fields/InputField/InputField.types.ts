import type { InputProps } from '@base-ui/react';

import type { FieldWrapperProps } from '../FieldWrapper/FieldWrapper.types';

export type InputFieldProps = Pick<
  InputProps,
  | 'accept'
  | 'autoComplete'
  | 'autoFocus'
  | 'capture'
  | 'defaultValue'
  | 'multiple'
  | 'onBlur'
  | 'onChange'
  | 'placeholder'
  | 'ref'
  | 'required'
  | 'type'
  | 'value'
> &
  FieldWrapperProps & {
    inputClassName?: string;
    onValueChange?: (value: string) => void;
    onValueChangeDebounceMs?: number;
  };
