import type {
  FieldRootProps,
  ComboboxRootProps,
  ComboboxInputProps,
} from '@base-ui/react';

import { Combobox, Field } from '@base-ui/react';
import { Check, ExpandMore } from '@mui/icons-material';

type ComboboxFieldProps<TValue, TMultiple extends boolean> = Pick<
  ComboboxRootProps<TValue, TMultiple>,
  | 'value'
  | 'defaultValue'
  | 'required'
  | 'onValueChange'
  | 'name'
  | 'multiple'
  | 'items'
> &
  Pick<
    FieldRootProps,
    | 'validationMode'
    | 'validationDebounceTime'
    | 'className'
    | 'invalid'
    | 'disabled'
  > &
  Pick<ComboboxInputProps, 'placeholder'> & {
    label?: string;
    description?: string;
    error?: string;
  };

export const ComboboxField = <TValue, TMultiple extends boolean>(
  props: ComboboxFieldProps<TValue, TMultiple>,
) => {
  const {
    className,
    defaultValue,
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
    <Field.Root
      className={className}
      disabled={disabled}
      invalid={invalid}
      name={name}
      validationDebounceTime={validationDebounceTime}
      validationMode={validationMode}
    >
      <Field.Label>
        {label}
        {required ? <span>*</span> : undefined}
      </Field.Label>
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

      <Field.Description>{description}</Field.Description>
      <Field.Item
      /* Groups individual items in a checkbox group or radio group with a label and description. Renders a <div> element. */
      />
      <Field.Error>{error}</Field.Error>
      <Field.Validity>
        {(props) => {
          // console.log('🚀 ~ Field.Validity ~ props:', props);

          return <p>{error}</p>;
        }}
      </Field.Validity>
    </Field.Root>
  );
};
