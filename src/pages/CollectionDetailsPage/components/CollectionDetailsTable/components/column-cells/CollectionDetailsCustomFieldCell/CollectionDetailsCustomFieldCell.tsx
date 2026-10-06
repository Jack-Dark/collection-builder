import { useSelector } from '@tanstack/react-store';
import { Suspense } from 'react';

import type { CustomFieldTypeDef } from '#/api/db-tables-schema.types';

import { CheckboxField } from '#/components/Fields/CheckboxField';
import { useEditingCollectionItemsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

import type { CreateOrUpdateCollectionItemFormTypeDef } from '../../../../../CollectionDetailsPage.types';

import { CustomFieldValueCheckbox } from './components/CustomFieldValueCheckbox';
import { CustomFieldValueCombobox } from './components/CustomFieldValueCombobox';
import { CustomFieldValueNumberInput } from './components/CustomFieldValueNumberInput';
import { useSubscribeToCustomFieldValue } from './hooks/subscribe-to-custom-field-value';

type CollectionDetailsCustomFieldCellPropsDef = {
  customField: {
    id: number;
    name: string;
    type: CustomFieldTypeDef;
  };
  form: CreateOrUpdateCollectionItemFormTypeDef;
  rowId: string;
  rowIndex: number;
};

export const CollectionDetailsCustomFieldCell = (
  props: CollectionDetailsCustomFieldCellPropsDef,
) => {
  const { customField, form, rowId, rowIndex } = props;

  const { getIsEditingRowId } = useEditingCollectionItemsRowIds();

  const isEditingRow = getIsEditingRowId(rowId);

  const customFieldValue = useSubscribeToCustomFieldValue({
    customFieldId: customField.id,
    form,
    rowIndex,
  });

  const collectionItemId = useSelector(form.atom, ({ values }) => {
    return values.collectionItems[rowIndex].id;
  });

  return isEditingRow ? (
    <Suspense>
      <form.Field
        name={`collectionItems[${rowIndex}].customFieldValues.${customField.id}`}
      >
        {(field) => {
          return (
            <>
              {customField.type === 'boolean' && (
                <CustomFieldValueCheckbox
                  customField={customField}
                  field={field}
                  form={form}
                  rowIndex={rowIndex}
                />
              )}

              {customField.type === 'number' && (
                <CustomFieldValueNumberInput
                  customField={customField}
                  field={field}
                  form={form}
                  rowIndex={rowIndex}
                />
              )}

              {customField.type === 'string' && (
                <CustomFieldValueCombobox
                  collectionItemId={collectionItemId}
                  customField={customField}
                  field={field}
                  form={form}
                  rowIndex={rowIndex}
                />
              )}
            </>
          );
        }}
      </form.Field>
    </Suspense>
  ) : (
    <>
      {customField.type === 'boolean' ? (
        <CheckboxField checked={!!customFieldValue?.data?.value} disabled />
      ) : (
        <p>{customFieldValue?.data?.value || '-'}</p>
      )}
    </>
  );
};
