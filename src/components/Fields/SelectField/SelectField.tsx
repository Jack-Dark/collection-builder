import { Select } from '@base-ui/react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Fragment } from 'react/jsx-runtime';

import type { SelectFieldPropsDef } from './SelectField.types';

import { FieldWrapper } from '../FieldWrapper';

export const SelectField = <
  TItem extends { [k: string]: any; separator?: true },
>(
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
    items,
    keyPrefix = 'key',
    label,
    labelProperty = 'label',
    name,
    onValueChange,
    placeholder,
    RenderItem = (item) => {
      return <span>{String(item[labelProperty])}</span>;
    },
    RenderValue = (item) => {
      return <span>{String(item[labelProperty])}</span>;
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
        itemToStringValue={(item) => {
          return String(item[idProperty]);
        }}
        onValueChange={(item) => {
          onValueChange(item);
        }}
      >
        <Select.Trigger className="grid grid-cols-[1fr_auto] gap-1 md:gap-2 p-1.5 bg-white border border-black cursor-pointer">
          <Select.Value
            className="grid justify-start"
            placeholder={placeholder}
          >
            {(item) => {
              return <RenderValue {...item} />;
            }}
          </Select.Value>
          <Select.Icon>
            <ExpandMoreIcon />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner align="start" alignItemWithTrigger={false}>
            <Select.Popup className="min-w-25 bg-white text-black py-2 rounded-sm shadow-lg max-h-100 overflow-auto">
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
    </FieldWrapper>
  );
};
