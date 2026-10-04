import { Select } from '@base-ui/react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Fragment } from 'react/jsx-runtime';

import type {
  DefaultSelectItemDef,
  SelectFieldPropsDef,
} from './SelectField.types';

import { FieldWrapper } from '../FieldWrapper';

export const SelectField = <TItem extends DefaultSelectItemDef>(
  props: SelectFieldPropsDef<TItem>,
) => {
  const {
    className,
    description,
    disabled,
    error,
    hideLabel,
    idProperty = 'id',
    invalid,
    isItemEqualToValue = (item, value) => {
      return item[idProperty] === value[idProperty];
    },
    items,
    itemToStringLabel = (item) => {
      if (item) {
        const label = item[labelProperty];

        const stringLabel = String(label);
        if (label == stringLabel) {
          return stringLabel;
        }
      }

      return '';
    },
    itemToStringValue = (item) => {
      if (item) {
        const value = item[idProperty];
        const stringValue = String(value);
        if (value == stringValue) {
          return stringValue;
        }
      }

      return '';
    },
    keyPrefix = 'key',
    label,
    labelProperty = 'label',
    name,
    onValueChange,
    placeholder,
    RenderItem = ({ item, ...rest }) => {
      return <span {...rest}>{itemToStringLabel(item)}</span>;
    },
    RenderValue = ({ item, ...rest }) => {
      return <span {...rest}>{itemToStringLabel(item)}</span>;
    },
    required,
    validationDebounceTime,
    validationMode,
    ...rest
  } = props;

  return (
    <FieldWrapper
      className={className}
      description={description}
      disabled={disabled}
      error={error}
      hideLabel={hideLabel}
      invalid={invalid}
      label={label}
      name={name}
      required={required}
      validationDebounceTime={validationDebounceTime}
      validationMode={validationMode}
    >
      <Select.Root
        {...rest}
        isItemEqualToValue={isItemEqualToValue}
        itemToStringLabel={itemToStringLabel}
        itemToStringValue={itemToStringValue}
        onValueChange={(item) => {
          onValueChange(item);
        }}
      >
        <Select.Trigger className="grid grid-cols-[1fr_auto] gap-1 md:gap-2 p-1.5 bg-white border border-black cursor-pointer">
          <Select.Value
            className="grid justify-start data-placeholder:text-gray-400"
            placeholder={placeholder}
          >
            {(item) => {
              return (
                <RenderValue
                  className={
                    item.disabled ? 'text-gray-500 cursor-not-allowed' : ''
                  }
                  item={item}
                />
              );
            }}
          </Select.Value>
          <Select.Icon>
            <ExpandMoreIcon />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner align="start" alignItemWithTrigger={false}>
            <Select.Popup className="min-w-25 bg-white text-black border border-gray-300 py-2 rounded-sm shadow-lg max-h-100 overflow-auto">
              <Select.List>
                {items.map((item, index) => {
                  return (
                    <Fragment key={`${keyPrefix}-${item[idProperty] || index}`}>
                      {item.separator ? (
                        <Select.Separator className="mx-2 my-0.5 h-px bg-gray-300" />
                      ) : (
                        <Select.Item
                          className={`p-2 flex align-items-center ${
                            item.disabled
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'hover:bg-menu-primary-hover data-selected:bg-menu-primary-selected data-highlighted:bg-menu-primary-hover cursor-pointer'
                          }`}
                          disabled={item.disabled}
                          value={item}
                        >
                          <Select.ItemText>
                            <RenderItem item={item} />
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
    </FieldWrapper>
  );
};
