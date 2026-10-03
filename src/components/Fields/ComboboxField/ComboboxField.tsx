import { Combobox } from '@base-ui/react';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import _ from 'lodash';
import { useLayoutEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import type {
  ComboboxFieldPropsDef,
  ComboboxValueDef,
  TItemRecordDef,
} from './ComboboxField.types';

import { FieldWrapper } from '../FieldWrapper';

export const getNormalizedValue = (value: string) => {
  return value.trim().toLocaleLowerCase();
};

export const ComboboxField = <
  TItem extends TItemRecordDef,
  TMultiple extends boolean | undefined = false,
>(
  props: ComboboxFieldPropsDef<TItem, TMultiple>,
) => {
  const {
    allowCreatable,
    className,
    createItem,
    description,
    disabled,
    error,
    filter = (item, query) => {
      const normalizedQuery = getNormalizedValue(query);

      if (normalizedQuery) {
        const searchPattern = new RegExp(normalizedQuery, 'i');

        const label = itemToStringLabel(item);

        return searchPattern.test(label);
      }

      return true;
    },
    hideLabel,
    idProperty = 'id',
    inputValue,
    invalid,
    isItemEqualToValue = (item, value) => {
      return item[idProperty] === value[idProperty];
    },
    items = [],
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
    label,
    labelProperty = 'label',
    multiple,
    name,
    onRemoveChip,
    onValueChange,
    placeholder,
    RenderChip = ({ item }) => {
      return <>{itemToStringLabel(item)}</>;
    },
    RenderItem = ({ item }) => {
      return <>{itemToStringLabel(item)}</>;
    },
    required,
    sortItems = (items) => {
      return _.sortBy(items, (item) => {
        return itemToStringLabel(item);
      });
    },
    validationDebounceTime,
    validationMode,
    value,
    verifyShowNewItem,
  } = props;

  const [displayItems, setDisplayItems] = useState<TItem[]>([]);
  // const [selectedItems, setSelectedItems] = useState<TItem[]>([]);
  const [query, setQuery] = useState('');

  const trimmedQuery = useMemo(() => {
    return query.trim();
  }, [query]);

  const normalizedQuery = useMemo(() => {
    return getNormalizedValue(trimmedQuery);
  }, [trimmedQuery]);

  /** Item with label that matches query exactly (case insensitive) */
  const exactMatchItem = useMemo(() => {
    if (!normalizedQuery) {
      return;
    }

    return displayItems.find((item) => {
      const label = itemToStringLabel(item);

      const queryMatchesLabel = getNormalizedValue(label) === normalizedQuery;

      return queryMatchesLabel;
    });
  }, [normalizedQuery]);

  const getSelectedItemsArray = () => {
    if (Array.isArray(value)) {
      return value;
    } else if (value) {
      return [value];
    } else {
      return [];
    }
  };

  useLayoutEffect(() => {
    // ? Merge items in list with selected items. This ensures new items are always available even if they don't exist outside of the component yet
    // debugger;
    const includedItemsById = new Map<number, true>();
    const uniqueDisplayItems: TItem[] = [
      ...items,
      ...getSelectedItemsArray(),
    ].filter((item) => {
      if (!item[idProperty] || includedItemsById.has(item[idProperty])) {
        return false;
      } else {
        includedItemsById.set(item[idProperty], true);

        return true;
      }
    });

    const sortedDisplayItems = sortItems(uniqueDisplayItems);

    if (allowCreatable && normalizedQuery) {
      // @ts-expect-error
      const newItem: TItem = createItem?.(trimmedQuery) || {
        [idProperty]: uuidv4(),
        [labelProperty]: trimmedQuery,
      };

      newItem.creatable = true;

      if (exactMatchItem) {
        if (
          verifyShowNewItem?.({
            itemMatchingQuery: exactMatchItem,
            newItem,
            normalizedQuery,
            query,
          })
        ) {
          sortedDisplayItems.splice(0, 0, newItem);
        }
      } else {
        sortedDisplayItems.splice(0, 0, newItem);
      }
    }

    setDisplayItems(sortedDisplayItems);
  }, [!exactMatchItem, value, items, query]);

  useLayoutEffect(() => {
    if (multiple) {
      setQuery('');
    } else {
      setQuery(inputValue || '');
    }
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
      <Combobox.Root
        filter={filter}
        inputValue={query}
        isItemEqualToValue={isItemEqualToValue}
        items={displayItems}
        itemToStringLabel={itemToStringLabel}
        itemToStringValue={itemToStringValue}
        multiple={multiple}
        onInputValueChange={setQuery}
        onValueChange={(
          value:
            | (TMultiple extends true ? never : null)
            | ComboboxValueDef<TItem, TMultiple>,
          eventDetails: Combobox.Root.ChangeEventDetails,
        ) => {
          setQuery('');

          if (Array.isArray(value)) {
            value.forEach((item) => {
              delete item.creatable;

              // return item;
            });
            // setSelectedItems(cleanValues);
          } else {
            delete value?.creatable;
            // setSelectedItems([value as TItem]);
          }
          onValueChange?.(value, eventDetails);
        }}
        value={value}
      >
        <div className="grid gap-2">
          {Array.isArray(value) && (
            <Combobox.Chips
              aria-label={value.length > 0 ? 'Selected labels' : undefined}
              className="flex items-center gap-2 flex-wrap"
            >
              {value.map((item) => {
                const label = itemToStringLabel(item);

                return (
                  <Combobox.Chip
                    aria-description="Press Backspace or Delete to remove"
                    aria-label={label}
                    className="flex items-center gap-1 border rounded-xl px-2 py-.5"
                    key={item[idProperty]}
                  >
                    <RenderChip item={item} />
                    <Combobox.ChipRemove
                      aria-label={`Remove ${label}`}
                      className="hover:text-red-700 cursor-pointer leading-0"
                      onClick={() => {
                        onRemoveChip?.(item);
                      }}
                    >
                      <ClearIcon fontSize="inherit" />
                    </Combobox.ChipRemove>
                  </Combobox.Chip>
                );
              })}
            </Combobox.Chips>
          )}

          <Combobox.Value>
            {(value) => {
              return multiple ? (
                <Combobox.Input
                  className="input w-full"
                  placeholder={placeholder}
                  // value={query}
                />
              ) : (
                <Combobox.Input
                  className="input w-full"
                  placeholder={placeholder}
                  value={value}
                />
              );
            }}
          </Combobox.Value>
        </div>

        <Combobox.Portal>
          <Combobox.Positioner
            align="start"
            className="styles.Positioner"
            sideOffset={4}
          >
            <Combobox.Popup className="bg-white text-black border border-gray-300 py-2 rounded-sm shadow-lg max-h-100 overflow-auto">
              {!allowCreatable && (
                <Combobox.Empty>
                  <div className="p-2 text-gray-500">No matches</div>
                </Combobox.Empty>
              )}
              <Combobox.List>
                {(listItem: TItem) => {
                  return (
                    <Combobox.Item
                      className="flex gap-2 items-center p-2 data-selected:bg-menu-primary-selected data-highlighted:bg-menu-primary-hover cursor-pointer"
                      disabled={listItem.disabled}
                      key={listItem[idProperty]}
                      value={listItem}
                    >
                      {listItem.creatable ? (
                        <span className="flex gap-1">
                          <span>Add "{itemToStringLabel(listItem)}"</span>
                          <AddIcon className="ml-4" />
                        </span>
                      ) : (
                        <RenderItem item={listItem} />
                      )}

                      {multiple && (
                        <Combobox.ItemIndicator>
                          <CheckIcon fontSize="inherit" />
                        </Combobox.ItemIndicator>
                      )}
                    </Combobox.Item>
                  );
                }}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </FieldWrapper>
  );
};
