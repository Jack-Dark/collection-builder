import type { ComboboxRootProps, ComboboxInputProps } from '@base-ui/react';

import type { FieldWrapperProps } from '../FieldWrapper/FieldWrapper.types';

export type ComboboxFieldProps<TValue> = Pick<
  ComboboxRootProps<TValue>,
  | 'itemToStringLabel'
  | 'itemToStringValue'
  | 'filter'
  | 'name'
  | 'onValueChange'
  | 'required'
  | 'isItemEqualToValue'
> &
  Pick<ComboboxInputProps, 'placeholder'> &
  FieldWrapperProps & {
    createCreatable?: (query: string) => TValue;
    hideLabel?: boolean;
    identifyCreatable?: (item: TValue) => boolean;
    inputValue: string;
    items: TValue[];
  };
