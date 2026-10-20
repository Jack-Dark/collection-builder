import { useMemo } from 'react';

import type { CreateOrUpdateCollectionItemFormTypeDef } from '#/pages/CollectionDetailsPage/CollectionDetailsPage.types';

import { InputField } from '#/components/Fields/InputField';
import { useEditingCollectionItemsRowIds } from '#/pages/CollectionDetailsPage/hooks/use-editing-collection-items-row-ids';

export const CollectionDetailsNameCell = ({
  form,
  rowId,
  rowIndex,
}: {
  form: CreateOrUpdateCollectionItemFormTypeDef;
  rowId: string;
  rowIndex: number;
}) => {
  const { editingRowIds, getIsEditingRowId } =
    useEditingCollectionItemsRowIds();

  const isEditingRow = useMemo(() => {
    return getIsEditingRowId(rowId);
  }, [editingRowIds]);

  const isFirstEditRow = editingRowIds[0] === rowId;

  const autoFocusNewRow = useMemo(() => {
    const isNewRow = Number.isNaN(Number(rowId));
    const isLastRow = editingRowIds[editingRowIds.length - 1] === rowId;

    return isNewRow && isLastRow;
  }, [editingRowIds]);

  return (
    <form.Field name={`collectionItems[${rowIndex}].name`}>
      {(field) => {
        return isEditingRow ? (
          <InputField
            autoFocus={isFirstEditRow || autoFocusNewRow}
            error={field.errors}
            hideLabel
            name={field.name}
            onValueChange={field.handleChange}
            placeholder="Input name..."
            required
            value={field.value}
          />
        ) : (
          <p>{field.value}</p>
        );
      }}
    </form.Field>
  );
};
