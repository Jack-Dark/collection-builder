import { Combobox } from '@base-ui/react';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useMemo, useState } from 'react';

import type { ComboboxFieldProps } from './ComboboxField.types';

import { ConditionalWrapper } from '../ConditionalWrapper';
import { FieldWrapper } from '../FieldWrapper';

const getLowerTrimmedValue = (value: string) => {
  return value.trim().toLocaleLowerCase();
};

export const ComboboxField = <TValue,>(props: ComboboxFieldProps<TValue>) => {
  const {
    className,
    createCreatable,
    description,
    disabled,
    error,
    filter = (item, query) => {
      const label = itemToStringLabel(item);

      const loweredQuery = getLowerTrimmedValue(query);
      if (loweredQuery) {
        if (hasExactMatch) {
          return getLowerTrimmedValue(label) === loweredQuery;
        } else {
          const searchPattern = new RegExp(query, 'i');

          return searchPattern.test(label);
        }
      }

      return true;
    },
    hideLabel,
    inputValue = '',
    invalid,
    items,
    itemToStringLabel = (item) => {
      if (item) {
        return typeof item == 'string' ? item : String(item);
      }

      return '';
    },
    itemToStringValue = (item) => {
      if (item) {
        return typeof item == 'string' ? item : String(item);
      }

      return '';
    },
    label,
    name,
    onValueChange,
    placeholder,
    required,
    validationDebounceTime,
    validationMode,
  } = props;

  const [query, setQuery] = useState<string>('');

  const loweredQuery = getLowerTrimmedValue(query);

  /** Case insensitive. */
  const hasExactMatch = useMemo(() => {
    return items.some((item) => {
      const label = itemToStringLabel(item);

      return getLowerTrimmedValue(label) === loweredQuery;
    });
  }, [loweredQuery]);

  const showCreatable = !!createCreatable && !!loweredQuery && !hasExactMatch;

  const itemsForView = useMemo(() => {
    if (showCreatable) {
      const newItem = createCreatable(query);

      return [newItem, ...items];
    }

    return items;
  }, [query]);

  const getIsNewItem = (item: TValue): boolean => {
    if (showCreatable) {
      const newItem = createCreatable?.(query);
      const itemValue = itemToStringValue(item);
      const newItemValue = itemToStringValue(newItem);

      return itemValue === newItemValue;
    }

    return false;
  };

  useEffect(() => {
    setQuery(inputValue || '');
  }, [inputValue]);

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
      <div>
        <Combobox.Root
          filter={filter}
          inputValue={query}
          items={itemsForView}
          onInputValueChange={setQuery}
          onValueChange={(value, event) => {
            setQuery('');

            return onValueChange?.(value, event);
          }}
        >
          <div className="relative flex items-center">
            <Combobox.Value>
              {(item: TValue) => {
                return (
                  <Combobox.Input
                    className="input w-full pr-8"
                    key={itemToStringValue(item)}
                    placeholder={placeholder}
                    value={query}
                  />
                );
              }}
            </Combobox.Value>
          </div>

          <Combobox.Portal>
            <Combobox.Positioner align="start">
              <Combobox.Popup className="bg-white text-black py-2 rounded-sm shadow-lg max-h-100 overflow-auto">
                {!createCreatable && (
                  <Combobox.Empty>
                    <div className="p-2 text-gray-500">No matches</div>
                  </Combobox.Empty>
                )}

                <Combobox.List>
                  {(item: TValue) => {
                    const value = itemToStringValue(item);
                    const label = itemToStringLabel(item);
                    const isNewItem = getIsNewItem(item);

                    return (
                      <Combobox.Item
                        className="p-2 data-selected:bg-menu-primary-selected data-highlighted:bg-menu-primary-hover cursor-pointer"
                        key={value}
                        value={item}
                      >
                        <ConditionalWrapper
                          condition={isNewItem}
                          Wrapper={({ children }) => {
                            return (
                              <span className="flex gap-2 align-items-center">
                                <span>Add "{children}"</span>
                                <AddIcon className="ml-4" />
                              </span>
                            );
                          }}
                        >
                          {label}
                        </ConditionalWrapper>
                      </Combobox.Item>
                    );
                  }}
                </Combobox.List>
              </Combobox.Popup>
            </Combobox.Positioner>
          </Combobox.Portal>
        </Combobox.Root>
      </div>
    </FieldWrapper>
  );
};
