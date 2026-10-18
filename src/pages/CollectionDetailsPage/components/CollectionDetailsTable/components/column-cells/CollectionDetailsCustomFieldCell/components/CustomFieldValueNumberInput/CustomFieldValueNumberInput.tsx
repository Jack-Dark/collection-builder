import type { AnyFieldApi } from '@tanstack/react-form';

import type { CustomFieldTypeDef } from '#/api/db-tables-schema.types';

import { useCreateCustomFieldValues } from '#/api/routes/custom-field-values/create-custom-field-value/create-custom-field-value.react-query';
import { InputField } from '#/components/Fields/InputField';
import { useLastAddedCustomFieldValues } from '#/pages/CollectionDetailsPage/CollectionDetailsPage.form';

type CustomFieldValueNumberInputPropsDef<TField extends AnyFieldApi> = {
  customField: {
    id: number;
    name: string;
    type: CustomFieldTypeDef;
  };
  /** The specific custom field value form field where this component renders */
  field: TField;
};

export const CustomFieldValueNumberInput = <TField extends AnyFieldApi>({
  customField,
  field,
}: CustomFieldValueNumberInputPropsDef<TField>) => {
  const { onCreateCustomFieldValues, processing } =
    useCreateCustomFieldValues();

  const { updateLastAddedCustomFieldValues } = useLastAddedCustomFieldValues();

  return (
    <InputField
      disabled={processing}
      onValueChange={async (value) => {
        if (value) {
          const formattedValue = Number(value);
          const [newCustomFieldValue] = await onCreateCustomFieldValues({
            records: [
              {
                customFieldId: customField.id,
                value: formattedValue,
              },
            ],
          });
          updateLastAddedCustomFieldValues({
            [customField.id]: newCustomFieldValue,
          });
          field.handleChange(newCustomFieldValue);
        } else {
          updateLastAddedCustomFieldValues({
            [customField.id]: undefined,
          });
          field.handleChange(undefined);
        }
      }}
      onValueChangeDebounceMs={500}
      placeholder={`Input ${customField.name}...`}
      type="number"
      value={field.value?.valueNumber ?? ''}
    />
  );
};
