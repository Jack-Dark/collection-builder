import { Select } from '@base-ui/react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Fragment } from 'react/jsx-runtime';

import type { SelectFieldPropsDef } from './SelectField.types';

export const SelectField = <
  TItem extends { [k: string]: any; separator?: true },
>(
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
              {items.map((item, index) => {
                return (
                  <Fragment key={`${keyPrefix}-${item[idProperty] || index}`}>
                    {item.separator ? (
                      <Select.Separator className="mx-2 my-0.5 h-px bg-gray-300" />
                    ) : (
                      <Select.Item
                        className="p-2 hover:bg-menu-primary-hover data-selected:bg-menu-primary-selected data-highlighted:bg-menu-primary-hover cursor-pointer flex align-items-center"
                        value={item}
                      >
                        <Select.ItemText>
                          <RenderItem {...item} />
                        </Select.ItemText>
                      </Select.Item>
                    )}
                  </Fragment>
                );
              })}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
};
