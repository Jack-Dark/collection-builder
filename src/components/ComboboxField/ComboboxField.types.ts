import type { ComboboxRootProps, ComboboxInputProps } from '@base-ui/react';

import type { FieldWrapperProps } from '../FieldWrapper/FieldWrapper.types';

export type ComboboxFieldProps<TValue extends Record<string, any>> = Pick<
  ComboboxRootProps<TValue>,
  'name' | 'onValueChange' | 'required' | 'value' | 'defaultValue'
> &
  Pick<ComboboxInputProps, 'placeholder'> &
  FieldWrapperProps & {
    allowCreatable?: boolean;
    idProperty?: keyof TValue;
    items: TValue[];
    labelProperty?: keyof TValue;
    onValueChange: (item: ComboboxFieldItemProps | undefined) => void;
  };

export type ComboboxFieldItemProps = {
  id: string | number;
  /** Only used internally when a new item can be created. */
  isCreatable?: boolean;
  label: string;
};
