import type { AnyFieldApi } from '@tanstack/react-form';

import type { CustomFieldTypeDef } from '#/api/db-tables-schema.types';

import { useCreateCustomFieldValues } from '#/api/routes/custom-field-values/create-custom-field-value/create-custom-field-value.react-query';
import { CheckboxField } from '#/components/Fields/CheckboxField';

import type { CreateOrUpdateCollectionItemFormTypeDef } from '../../../../../../../CollectionDetailsPage.types';

import { useSubscribeToCustomFieldValue } from '../../hooks/subscribe-to-custom-field-value';

type CustomFieldValueCheckboxPropsDef<TField extends AnyFieldApi> = {
  customField: {
    id: number;
    name: string;
    type: CustomFieldTypeDef;
  };
  /** The specific custom field value form field where this component renders */
  field: TField;
  form: CreateOrUpdateCollectionItemFormTypeDef;
  rowIndex: number;
};

export const CustomFieldValueCheckbox = <TField extends AnyFieldApi>({
  customField,
  field,
  form,
  rowIndex,
}: CustomFieldValueCheckboxPropsDef<TField>) => {
  const { onCreateCustomFieldValues, processing } =
    useCreateCustomFieldValues();

  const customFieldValue = useSubscribeToCustomFieldValue<boolean, typeof form>(
    {
      customFieldId: customField.id,
      form,
      rowIndex,
    },
  );

  return (
    <CheckboxField
      checked={customFieldValue?.data?.value}
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
