import type { ComboboxRootProps, ComboboxInputProps } from '@base-ui/react';
import type { JSXElementConstructor } from 'react';

import type { FieldWrapperProps } from '../FieldWrapper/FieldWrapper.types';

export type ComboboxFieldV2Props<TValue> = Pick<
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
    createItem?: (query: string) => TValue;
    hideLabel?: boolean;
    identifyCreatable?: (item: TValue) => boolean;
    inputValue: string;
    items: TValue[];
    RenderItem?: JSXElementConstructor<{ item: TValue }>;
  };
