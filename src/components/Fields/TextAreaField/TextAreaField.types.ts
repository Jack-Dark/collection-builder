import type { FieldControlProps } from '@base-ui/react';
import type { Ref } from 'react';

import type { FieldWrapperProps } from '../FieldWrapper/FieldWrapper.types';

export type TextAreaFieldPropsDef = Pick<
  FieldControlProps,
  'autoFocus' | 'placeholder' | 'required' | 'type' | 'value'
> &
  FieldWrapperProps & {
    onValueChange?: (value: string) => void;
    onValueChangeDebounceMs?: number;
    ref?: Ref<HTMLElement>;
  };
