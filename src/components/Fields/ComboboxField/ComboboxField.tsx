import type { HTMLAttributes, JSXElementConstructor } from 'react';

import { Combobox } from '@base-ui/react';
import { DragDropProvider } from '@dnd-kit/react';
import { useSortable, isSortable } from '@dnd-kit/react/sortable';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import _ from 'lodash';
import { useLayoutEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import type {
  ComboboxFieldPropsDef,
  ComboboxValueDef,
  TValueRecordDef,
} from './ComboboxField.types';

import { FieldWrapper } from '../FieldWrapper';

export const getNormalizedValue = (
  value: string,
  options?: { caseSensitive?: boolean },
) => {
  const trimmedQuery = value.trim();
  if (options?.caseSensitive) {
    return trimmedQuery;
  } else {
    return trimmedQuery.toLocaleLowerCase();
  }
};

export const ComboboxField = <
  TValue extends TValueRecordDef,
  TMultiple extends boolean | undefined = false,
>(
  props: ComboboxFieldPropsDef<TValue, TMultiple>,
) => {
  const {
    allowCreatable,
    label,
    ariaLabel = label,
    caseSensitiveCreation,
    caseSensitiveFilter,
    className,
    createNewItem,
    description,
    disabled,
    enableChipSort,
    error,
    filter = (item, query) => {
      const normalizedQuery = getNormalizedValue(query, {
        caseSensitive: caseSensitiveFilter,
      });

      if (normalizedQuery) {
        const searchPattern = new RegExp(
          normalizedQuery,
          caseSensitiveFilter ? undefined : 'i',
        );

        const label = itemToStringLabel(item);

        return searchPattern.test(label);
      }

      return true;
    },
    hideLabel,
    idProperty = 'id',
    inputValue = '',
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
    labelProperty = 'label',
    multiple,
    name,
    onChipSort,
    onRemoveChip,
    onValueChange,
    placeholder,
    RenderChip = ({ item }) => {
      return <p>{itemToStringLabel(item)}</p>;
    },
    RenderItem = ({ item, multiple, SelectedIndicator }) => {
      return (
        <>
          <p>{itemToStringLabel(item)}</p>

          {multiple && (
            <SelectedIndicator>
              <CheckIcon fontSize="inherit" />
            </SelectedIndicator>
          )}
        </>
      );
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

  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [displayItems, setDisplayItems] = useState<TValue[]>([]);
  const [query, setQuery] = useState(inputValue);

  const trimmedQuery = useMemo(() => {
    return query.trim();
  }, [query]);

  const normalizedQuery = useMemo(() => {
    return getNormalizedValue(trimmedQuery, {
      caseSensitive: caseSensitiveCreation,
    });
  }, [trimmedQuery]);

  /** Item with label that matches query exactly */
  const exactMatchItem = useMemo(() => {
    if (!normalizedQuery) {
      return;
    }

    return displayItems.find((item) => {
      const label = itemToStringLabel(item);

      const queryMatchesLabel =
        getNormalizedValue(label, { caseSensitive: caseSensitiveCreation }) ===
        normalizedQuery;

      return queryMatchesLabel;
    });
  }, [normalizedQuery, items]);

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
    const includedItemsById = new Map<string, true>();
    const uniqueDisplayItems: TValue[] = [
      ...items,
      ...getSelectedItemsArray(),
    ].filter((item) => {
      const idAsString = itemToStringValue(item);
      if (!idAsString || includedItemsById.has(idAsString)) {
        return false;
      } else {
        includedItemsById.set(idAsString, true);

        return true;
      }
    });

    const sortedDisplayItems = sortItems(uniqueDisplayItems);

    if (allowCreatable && normalizedQuery) {
      // @ts-expect-error
      const creatableItem: TValue = createNewItem?.(trimmedQuery) || {
        [idProperty]: uuidv4(),
        [labelProperty]: trimmedQuery,
      };

      creatableItem.creatable = true;

      if (normalizedQuery) {
        if (exactMatchItem) {
          if (
            verifyShowNewItem?.({
              itemMatchingQuery: exactMatchItem,
              newItem: creatableItem,
              normalizedQuery,
              query,
            })
          ) {
            sortedDisplayItems.splice(0, 0, creatableItem);
          }
        } else {
          sortedDisplayItems.splice(0, 0, creatableItem);
        }
      }
    }

    setDisplayItems(sortedDisplayItems);
  }, [!exactMatchItem, value, items, query, isInputFocused]);

  useLayoutEffect(() => {
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
            | ComboboxValueDef<TValue, TMultiple>,
          eventDetails: Combobox.Root.ChangeEventDetails,
        ) => {
          // setQuery('');

          if (Array.isArray(value)) {
            value.forEach((item) => {
              delete item.creatable;

              // return item;
            });
            // setSelectedItems(cleanValues);
          } else {
            delete value?.creatable;
            // setSelectedItems([value as TValue]);
          }
          onValueChange?.(value, eventDetails);
        }}
        value={value}
      >
        <div className="grid gap-2">
          {Array.isArray(value) && (
            <DragDropProvider
              onDragEnd={(event) => {
                if (event.canceled) return;

                const { source } = event.operation;

                if (isSortable(source)) {
                  const { index, initialIndex } = source;

                  if (initialIndex !== index) {
                    const newItems = [...value];
                    const [removed] = newItems.splice(initialIndex, 1);
                    newItems.splice(index, 0, removed);

                    onChipSort?.(newItems);
                  }
                }
              }}
            >
              <Combobox.Chips
                aria-label={value.length > 0 ? 'Selected labels' : undefined}
                className="flex items-center gap-2 flex-wrap"
              >
                {value.map((item, index) => {
                  const label = itemToStringLabel(item);
                  const key = itemToStringValue(item);

                  return (
                    <SortableChip
                      enableChipSort={enableChipSort}
                      id={key}
                      index={index}
                      item={item}
                      key={key}
                      label={label}
                      onRemoveChip={onRemoveChip}
                      RenderChip={RenderChip}
                    />
                  );
                })}
              </Combobox.Chips>
            </DragDropProvider>
          )}

          <Combobox.Value>
            {() => {
              return multiple ? (
                <Combobox.Input
                  aria-label={ariaLabel}
                  className="input w-full"
                  placeholder={placeholder}
                  value={query}
                />
              ) : (
                <Combobox.Input
                  aria-label={ariaLabel}
                  className="input w-full"
                  onBlur={() => {
                    setIsInputFocused(false);
                  }}
                  onFocus={() => {
                    setIsInputFocused(true);
                  }}
                  placeholder={placeholder}
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
            <Combobox.Popup
              className="bg-white text-black border border-gray-300 py-2 rounded-sm shadow-lg max-h-100 overflow-auto"
              hidden={!displayItems.length && !query}
            >
              {!allowCreatable && (
                <Combobox.Empty>
                  <div className="p-2 text-gray-500">No matches</div>
                </Combobox.Empty>
              )}
              <Combobox.List>
                {(listItem: TValue) => {
                  return (
                    <Combobox.Item
                      className="flex gap-2 items-center p-2 data-selected:bg-menu-primary-selected data-highlighted:bg-menu-primary-hover cursor-pointer"
                      disabled={listItem.disabled}
                      key={itemToStringValue(listItem)}
                      value={listItem}
                    >
                      {listItem.creatable ? (
                        <span className="flex gap-1 items-center">
                          <span>Add "{itemToStringLabel(listItem)}"</span>
                          <AddIcon fontSize="inherit" />
                        </span>
                      ) : (
                        <RenderItem
                          item={listItem}
                          multiple={multiple}
                          SelectedIndicator={Combobox.ItemIndicator}
                        />
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

const SortableChip = <TValue extends TValueRecordDef>(props: {
  enableChipSort: boolean | undefined;
  id: string;
  index: number;
  item: TValue;
  label: string;
  onRemoveChip: ((item: TValue) => void) | undefined;
  RenderChip: JSXElementConstructor<
    HTMLAttributes<HTMLElement> & { item: TValue }
  >;
}) => {
  const { enableChipSort, id, index, item, label, onRemoveChip, RenderChip } =
    props;

  const { ref } = useSortable({ disabled: !enableChipSort, id, index });

  return (
    <Combobox.Chip
      aria-description="Press Backspace or Delete to remove"
      aria-label={label}
      className="flex items-center gap-1 border rounded-xl px-2 py-.5"
      ref={ref}
    >
      {enableChipSort && (
        <DragIndicatorIcon
          className="text-gray-500 cursor-grab active:cursor-grabbing"
          fontSize="inherit"
        />
      )}
      <RenderChip item={item} />
      <Combobox.ChipRemove
        aria-label={`Remove ${label}`}
        className="text-gray-600 hover:text-red-700 cursor-pointer leading-0"
        onClick={() => {
          onRemoveChip?.(item);
        }}
      >
        <ClearIcon fontSize="inherit" />
      </Combobox.ChipRemove>
    </Combobox.Chip>
  );
};
