import type { SelectRootProps } from '@base-ui/react';
import type { JSXElementConstructor } from 'react';

import { Select } from '@base-ui/react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export type SelectFieldPropsDef<TItem extends Record<string, any>> = Omit<
  SelectRootProps<TItem>,
  'items' | 'onValueChange' | 'defaultValue'
> & {
  idProperty?: keyof TItem;
  items: TItem[];
  keyPrefix?: string;
  labelProperty?: keyof TItem;
  onValueChange: (item: TItem | null) => void | Promise<void>;
  RenderItem?: JSXElementConstructor<TItem>;
  RenderValue?: JSXElementConstructor<TItem>;
};

export const SelectField = <TItem extends Record<string, any>>(
  props: SelectFieldPropsDef<TItem>,
) => {
  const {
    idProperty = 'id',
    items,
    keyPrefix = 'key',
    labelProperty = 'label',
    onValueChange,
    RenderItem = (item) => {
      return <span>{String(item[labelProperty])}</span>;
    },
    RenderValue = (item) => {
      return <span>{String(item[labelProperty])}</span>;
    },
    ...rest
  } = props;

  return (
    <Select.Root
      {...rest}
      itemToStringValue={(item) => {
        return String(item[idProperty]);
      }}
      onValueChange={(item) => {
        onValueChange(item);
      }}
    >
      <Select.Trigger className="flex gap-1 md:gap-2 p-1.5 bg-white border border-black cursor-pointer">
        <Select.Value>
          {(item) => {
            return <RenderValue {...item} />;
          }}
        </Select.Value>
        <Select.Icon>
          <ExpandMoreIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner>
          <Select.Popup className="bg-white text-black py-2 rounded-sm shadow-lg max-h-100 overflow-auto">
            <Select.List>
              {items.map((item) => {
                return (
                  <Select.Item
                    className="p-2 hover:bg-menu-primary-hover data-selected:bg-menu-primary-selected data-highlighted:bg-menu-primary-hover cursor-pointer
                        flex align-items-center"
                    key={`${keyPrefix}-${item[idProperty]}`}
                    value={item}
                  >
                    <Select.ItemText>
                      <RenderItem {...item} />
                    </Select.ItemText>
                  </Select.Item>
                );
              })}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
};
