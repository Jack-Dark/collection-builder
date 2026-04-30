import { Combobox } from '@base-ui/react';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useMemo, useState } from 'react';

import type {
  ComboboxFieldItemProps,
  ComboboxFieldProps,
} from './ComboboxField.types';

import { FieldWrapper } from '../FieldWrapper';

export const ComboboxField = <TValue extends Record<string, any>>(
  props: ComboboxFieldProps<TValue>,
) => {
  const {
    allowCreatable,
    className,
    defaultValue,
    description,
    disabled,
    error,
    idProperty = 'id',
    invalid,
    items: originalItems,
    label,
    labelProperty = 'label',
    name,
    onValueChange,
    placeholder,
    required,
    validationDebounceTime,
    validationMode,
    value,
  } = props;

  const [query, setQuery] = useState('');

  const formattedItems = useMemo<ComboboxFieldItemProps[]>(() => {
    return originalItems.reduce<ComboboxFieldItemProps[]>((acc, item) => {
      const formattedItem: ComboboxFieldItemProps = {
        id: item[idProperty],
        label: item[labelProperty],
      };

      return [...acc, formattedItem];
    }, [] satisfies ComboboxFieldItemProps[]);
  }, [originalItems]);

  const queryNotFound = useMemo<boolean>(() => {
    const queryRegExp = RegExp(query.trim(), 'i');

    if (!query) {
      return false;
    }

    const matchFound = formattedItems.some((item) => {
      const transformedLabel = String(item.label).trim();

      return queryRegExp.test(transformedLabel);
    });

    return !matchFound;
  }, [query, formattedItems]);

  const itemsForView = useMemo<ComboboxFieldItemProps[]>(() => {
    if (queryNotFound) {
      return [
        {
          id: query,
          isCreatable: true,
          label: `Add "${query}" to ${label} options`,
        },
      ] satisfies ComboboxFieldItemProps[];
    } else {
      return formattedItems;
    }
  }, [formattedItems, queryNotFound, query]);

  return (
    <FieldWrapper
      className={className}
      description={description}
      disabled={disabled}
      error={error}
      invalid={invalid}
      label={label}
      name={name}
      required={required}
      validationDebounceTime={validationDebounceTime}
      validationMode={validationMode}
    >
      <div>
        <Combobox.Root
          defaultValue={defaultValue}
          items={itemsForView}
          onInputValueChange={setQuery}
          onValueChange={(id) => {
            const selected = itemsForView.find((item) => {
              return item.id === id;
            });

            if (allowCreatable || queryNotFound) {
              return onValueChange?.(selected);
            }
          }}
          value={value}
        >
          <div className="relative">
            <Combobox.Input
              className="input w-full pr-18"
              placeholder={placeholder}
            />
            <div className="flex flex-nowrap justify-items-end gap-2 absolute right-2 top-1/2 -translate-y-1/2 **:grid **:items-center **:justify-items-center">
              {value && (
                <Combobox.Clear>
                  <ClearIcon className="cursor-pointer" fontSize="small" />
                </Combobox.Clear>
              )}

              <Combobox.Trigger>
                <ExpandMoreIcon className="cursor-pointer" />
              </Combobox.Trigger>
            </div>
          </div>

          <Combobox.Portal>
            <Combobox.Positioner align="start">
              {/*
               // TODO - UPDATE TO USE SCROLLAREA? 
              */}
              <Combobox.Popup className="bg-white text-black py-2 rounded-sm shadow-lg max-h-100 overflow-auto">
                {!itemsForView.length && !allowCreatable && (
                  <Combobox.Empty className="p-2 text-gray-500">
                    No matches
                  </Combobox.Empty>
                )}

                <Combobox.List>
                  {({ id, isCreatable, label }: ComboboxFieldItemProps) => {
                    return (
                      <Combobox.Item
                        className="p-2 hover:bg-menu-primary-hover data-selected:bg-menu-primary-selected data-highlighted:bg-menu-primary-hover cursor-pointer
                        flex align-items-center"
                        key={id}
                        onClick={
                          isCreatable
                            ? (e) => {
                                e.preventDefault();
                                onValueChange({ id, label });
                              }
                            : undefined
                        }
                        value={id}
                      >
                        {label}
                        {isCreatable && <AddIcon className="ml-4" />}
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
