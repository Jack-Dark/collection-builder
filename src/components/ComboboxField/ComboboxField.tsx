import { Combobox } from '@base-ui/react';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import type { ComboboxFieldProps } from './ComboboxField.types';

import { FieldWrapper } from '../FieldWrapper';

export const ComboboxField = <TValue, TMultiple extends boolean>(
  props: ComboboxFieldProps<TValue, TMultiple>,
) => {
  const {
    className,
    description,
    disabled,
    error,
    invalid,
    items,
    label,
    name,
    onValueChange,
    placeholder,
    required,
    validationDebounceTime,
    validationMode,
    value,
  } = props;

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
          items={items}
          onValueChange={onValueChange}
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
              <Combobox.Popup className="bg-white">
                <Combobox.Empty className="text-gray-500">
                  No matches
                </Combobox.Empty>

                <Combobox.List className="text-black pv-2 rounded-sm shadow-lg max-h-100 overflow-auto">
                  {(region: string) => {
                    return (
                      <Combobox.Item
                        className="p-2 hover:bg-primary-50 data-selected:bg-primary-100 data-highlighted:bg-primary-50 cursor-pointer"
                        key={region}
                        value={region}
                      >
                        {region}
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
