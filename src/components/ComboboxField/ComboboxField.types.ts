import type { ComboboxRootProps, ComboboxInputProps } from '@base-ui/react';

import type { FieldWrapperProps } from '../FieldWrapper/FieldWrapper.types';

export type ComboboxFieldProps<TValue, TMultiple extends boolean> = Pick<
  ComboboxRootProps<TValue, TMultiple>,
  'items' | 'multiple' | 'name' | 'onValueChange' | 'required' | 'value'
> &
  Pick<ComboboxInputProps, 'placeholder'> &
  FieldWrapperProps;
