import type { SelectRootProps } from '@base-ui/react';
import type { JSXElementConstructor } from 'react';

export type SelectFieldPropsDef<
  TItem extends { [k: string]: any; separator?: true },
> = Omit<SelectRootProps<TItem>, 'items' | 'onValueChange' | 'defaultValue'> & {
  idProperty?: keyof TItem;
  items: TItem[];
  keyPrefix?: string;
  labelProperty?: keyof TItem;
  onValueChange: (item: TItem | null) => void | Promise<void>;
  RenderItem?: JSXElementConstructor<TItem>;
  RenderValue?: JSXElementConstructor<TItem>;
};
