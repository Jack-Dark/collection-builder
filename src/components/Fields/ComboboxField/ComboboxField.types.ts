import type { ComboboxInputProps, ComboboxRootProps } from '@base-ui/react';
import type { JSXElementConstructor } from 'react';

import type { FieldWrapperProps } from '../FieldWrapper/FieldWrapper.types';

export type TItemRecordDef = {
  [key: string]: any;
  /** DO NOT USE. Added by the system if input can create new items. */
  creatable?: true;
};

export type ComboboxValueDef<
  TItem extends TItemRecordDef,
  TMultiple extends boolean | undefined,
> = TMultiple extends true ? TItem[] : TItem;

export type ComboboxFieldPropsDef<
  TItem extends TItemRecordDef,
  TMultiple extends boolean | undefined = false,
> = ComboboxRootProps<TItem, TMultiple> &
  Pick<ComboboxInputProps, 'placeholder'> &
  FieldWrapperProps & {
    allowCreatable?: boolean;
    createItem?: (query: string) => TItem;
    hideLabel?: boolean;
    idProperty?: keyof TItem;
    inputValue?: string;
    labelProperty?: keyof TItem;
    onRemoveChip?: (item: TItem) => void;
    RenderChip?: JSXElementConstructor<{ item: TItem }>;
    RenderItem?: JSXElementConstructor<{ item: TItem }>;
  };
