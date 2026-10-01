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

const getNormalizedValue = (value: string) => {
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
      const label = itemToStringLabel(item);

      const normalizedQuery = getNormalizedValue(query);
      if (normalizedQuery) {
        if (hasExactMatch) {
          return getNormalizedValue(label) === normalizedQuery;
        } else {
          const searchPattern = new RegExp(query, 'i');

          return searchPattern.test(label);
        }
      }

      return true;
    },
    hideLabel,
    idProperty = 'id',
    inputValue,
    invalid,
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
    validationDebounceTime,
    validationMode,
    value,
  } = props;

  const [displayItems, setDisplayItems] = useState<TItem[]>([...items]);
  const [selectedItems, setSelectedItems] = useState<TItem[]>([]);
  const [query, setQuery] = useState('');

  const trimmedQuery = useMemo(() => {
    return query.trim();
  }, [query]);

  const normalizedQuery = useMemo(() => {
    return trimmedQuery.toLocaleLowerCase();
  }, [trimmedQuery]);

  /** Case insensitive. */
  const hasExactMatch = useMemo(() => {
    return displayItems.some((item) => {
      const label = itemToStringLabel(item);

      return getNormalizedValue(label) === normalizedQuery;
    });
  }, [normalizedQuery]);

  const showCreateOption =
    !!allowCreatable && !!normalizedQuery && !hasExactMatch;

  const generateCreatableItem = () => {
    // @ts-expect-error
    const newItem: TItem = createItem?.(query) || {
      [idProperty]: uuidv4(),
      [labelProperty]: trimmedQuery,
    };

    newItem.creatable = true;

    return newItem;
  };

  useLayoutEffect(() => {
    // ? selected items contains creatable items which don't exist outside this component
    const newDisplayItems = _.sortBy([...items, ...selectedItems], (item) => {
      return itemToStringLabel(item);
    });

    if (showCreateOption) {
      const newItem = generateCreatableItem();

      newDisplayItems.splice(0, 0, newItem);
    }

    setDisplayItems(newDisplayItems);
  }, [showCreateOption, selectedItems, items, query]);

  useLayoutEffect(() => {
    if (multiple) {
      setQuery('');
    } else {
      setQuery(inputValue || '');
    }
  }, [inputValue]);

  useLayoutEffect(() => {
    if (value) {
      if (Array.isArray(value)) {
        setSelectedItems(value);
      } else {
        setSelectedItems([value as TItem]);
      }
    }
  }, [value]);

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
            const cleanValues = value.map((item) => {
              delete item.creatable;

              return item;
            });
            setSelectedItems(cleanValues);
          } else {
            delete value?.creatable;
            setSelectedItems([value as TItem]);
          }
          onValueChange?.(value, eventDetails);
        }}
        value={multiple ? selectedItems : selectedItems[0]}
      >
        <div className="styles.Container">
          <Combobox.InputGroup className="relative flex items-center">
            <Combobox.Value>
              {(selected: ComboboxValueDef<TItem, TMultiple>) => {
                return Array.isArray(selected) ? (
                  <Combobox.Chips
                    aria-label={
                      selected.length > 0 ? 'Selected labels' : undefined
                    }
                    className="flex gap-2 flex-wrap"
                  >
                    {selected.map((item) => {
                      const label = itemToStringLabel(item);
                      const id = itemToStringValue(item);

                      return (
                        <Combobox.Chip
                          aria-description="Press Backspace or Delete to remove"
                          aria-label={label}
                          className="flex items-center gap-1 border rounded-xl px-2 py-.5"
                          key={id}
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
                    <Combobox.Input
                      aria-description={
                        selected.length > 0
                          ? `${selected.length} selected. From the start of the input, press Left Arrow to focus the selected items`
                          : undefined
                      }
                      className="input w-full"
                      // onKeyDown={handleInputKeyDown}
                      placeholder={placeholder}
                    />
                  </Combobox.Chips>
                ) : (
                  <Combobox.Input
                    className="input w-full"
                    key={itemToStringValue(selected)}
                    placeholder={placeholder}
                    value={query}
                  />
                );
              }}
            </Combobox.Value>
          </Combobox.InputGroup>
        </div>

        <Combobox.Portal>
          <Combobox.Positioner
            align="start"
            className="styles.Positioner"
            sideOffset={4}
          >
            <Combobox.Popup className="bg-white text-black py-2 rounded-sm shadow-lg max-h-100 overflow-auto">
              {!allowCreatable && (
                <Combobox.Empty>
                  <div className="p-2 text-gray-500">No matches</div>
                </Combobox.Empty>
              )}
              <Combobox.List>
                {(item: TItem) => {
                  const id = itemToStringValue(item);

                  return (
                    <Combobox.Item
                      className="flex gap-2 items-center p-2 data-selected:bg-menu-primary-selected data-highlighted:bg-menu-primary-hover cursor-pointer"
                      key={id}
                      value={item}
                    >
                      <Combobox.ItemIndicator>
                        <CheckIcon fontSize="inherit" />
                      </Combobox.ItemIndicator>
                      {item.creatable ? (
                        <span className="flex gap-1">
                          <span>Add "{query}"</span>
                          <AddIcon className="ml-4" />
                        </span>
                      ) : (
                        <RenderItem item={item} />
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
