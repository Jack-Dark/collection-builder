import type { AnyFieldApi } from '@tanstack/react-form';

import type { CustomFieldTypeDef } from '#/api/db-tables-schema.types';

import { useCreateCustomFieldValues } from '#/api/routes/custom-field-values/create-custom-field-value/create-custom-field-value.react-query';
import { CheckboxField } from '#/components/Fields/CheckboxField';

type CustomFieldValueCheckboxPropsDef<TField extends AnyFieldApi> = {
  customField: {
    id: number;
    name: string;
    type: CustomFieldTypeDef;
  };
  /** The specific custom field value form field where this component renders */
  field: TField;
};

export const CustomFieldValueCheckbox = <TField extends AnyFieldApi>({
  customField,
  field,
}: CustomFieldValueCheckboxPropsDef<TField>) => {
  const { onCreateCustomFieldValues, processing } =
    useCreateCustomFieldValues();

  return (
    <CheckboxField
      checked={!!field.value?.valueBoolean}
      disabled={processing}
      onCheckedChange={async (value) => {
        const [newCustomFieldValue] = await onCreateCustomFieldValues({
          records: [{ customFieldId: customField.id, value }],
        });

        field.handleChange(newCustomFieldValue);
      }}
    />
  );
};
