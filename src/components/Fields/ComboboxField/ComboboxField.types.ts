import type { ComboboxInputProps, ComboboxRootProps } from '@base-ui/react';
import type { HTMLAttributes, JSXElementConstructor } from 'react';

import type { FieldWrapperProps } from '../FieldWrapper/FieldWrapper.types';

export type TItemRecordDef = {
  [key: string]: any;
  /** DO NOT USE. Added by the system if input can create new items. */
  creatable?: true;
  disabled?: true;
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
    createItem?: (trimmedQuery: string) => TItem;
    hideLabel?: boolean;
    idProperty?: keyof TItem;
    inputValue?: string;
    labelProperty?: keyof TItem;
    onRemoveChip?: (item: TItem) => void;
    RenderChip?: JSXElementConstructor<
      HTMLAttributes<HTMLElement> & { item: TItem }
    >;
    RenderItem?: JSXElementConstructor<
      HTMLAttributes<HTMLElement> & { item: TItem }
    >;
    sortItems?: (items: TItem[]) => TItem[];
    /** Runs if the search query matches an existing item. Allows a second validation to compare more than just the query value. */
    verifyShowNewItem?: (props: {
      itemMatchingQuery: TItem | undefined;
      newItem: TItem;
      normalizedQuery: string;
      query: string;
    }) => boolean;
  };
