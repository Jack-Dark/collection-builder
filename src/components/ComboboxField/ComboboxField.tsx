import { Combobox } from '@base-ui/react';
import { Check, ExpandMore } from '@mui/icons-material';

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
      <Combobox.Root items={items} onValueChange={onValueChange} value={value}>
        <Combobox.Input placeholder={placeholder} />
        <Combobox.Clear />
        <Combobox.Trigger>
          <ExpandMore />
        </Combobox.Trigger>
        <Combobox.Portal>
          <Combobox.Positioner>
            <Combobox.Popup>
              <Combobox.Empty>No matches</Combobox.Empty>
              <Combobox.List>
                {(region: string) => {
                  return (
                    <Combobox.Item key={region} value={region}>
                      <Combobox.ItemIndicator>
                        <Check />
                      </Combobox.ItemIndicator>

                      {region}
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
