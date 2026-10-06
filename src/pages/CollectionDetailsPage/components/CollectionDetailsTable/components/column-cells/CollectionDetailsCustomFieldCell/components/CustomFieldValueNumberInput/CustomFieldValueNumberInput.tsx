import type { AnyFieldApi } from '@tanstack/react-form';

import type { CustomFieldTypeDef } from '#/api/db-tables-schema.types';

import { useCreateCustomFieldValues } from '#/api/routes/custom-field-values/create-custom-field-value/create-custom-field-value.react-query';
import { InputField } from '#/components/Fields/InputField';

import type { CreateOrUpdateCollectionItemFormTypeDef } from '../../../../../../../CollectionDetailsPage.types';

import { useSubscribeToCustomFieldValue } from '../../hooks/subscribe-to-custom-field-value';

type CustomFieldValueNumberInputPropsDef<TField extends AnyFieldApi> = {
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

export const CustomFieldValueNumberInput = <TField extends AnyFieldApi>({
  customField,
  field,
  form,
  rowIndex,
}: CustomFieldValueNumberInputPropsDef<TField>) => {
  const { onCreateCustomFieldValues, processing } =
    useCreateCustomFieldValues();

  // TODO - FIGURE OUT HOW TO ADD SOME ADDITIONAL LOGIC TO CLEAR OUT UNUSED NUMBER CUSTOM FIELD VALUES SINCE THIS IS SAVED ON BLUR

  const customFieldValue = useSubscribeToCustomFieldValue<number, typeof form>({
    customFieldId: customField.id,
    form,
    rowIndex,
  });

  return (
    <InputField
      disabled={processing}
      onValueChange={async (value) => {
        const formattedValue = Number(value);

        const [newCustomFieldValue] = await onCreateCustomFieldValues({
          records: [
            {
              customFieldId: customField.id,
              value: formattedValue,
            },
          ],
        });

        field.handleChange(newCustomFieldValue);
      }}
      placeholder={`Input ${customField.name}...`}
      triggerOnBlur
      type="number"
      value={customFieldValue?.data?.value}
    />
  );
};
