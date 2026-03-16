import type { ComboboxRootProps, ComboboxInputProps } from '@base-ui/react';

import { Combobox } from '@base-ui/react';
import { Check, ExpandMore } from '@mui/icons-material';

import type { FieldWrapperProps } from '../FieldWrapper';

import { FieldWrapper } from '../FieldWrapper';

type ComboboxFieldProps<TValue, TMultiple extends boolean> = Pick<
  ComboboxRootProps<TValue, TMultiple>,
  'items' | 'multiple' | 'name' | 'onValueChange' | 'required' | 'value'
> &
  Pick<ComboboxInputProps, 'placeholder'> &
  FieldWrapperProps;

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
