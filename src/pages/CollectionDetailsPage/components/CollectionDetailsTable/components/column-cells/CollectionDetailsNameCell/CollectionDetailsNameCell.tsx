import type { CreateOrUpdateCollectionItemFormTypeDef } from '#/pages/CollectionDetailsPage/CollectionDetailsPage.types';

import { InputField } from '#/components/Fields/InputField';
import { useEditingCollectionItemsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collection-items-row-ids';

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

  const isEditingRow = getIsEditingRowId(rowId);

  const isFirstEditRow = editingRowIds[0] === rowId;

  return (
    <form.Field name={`collectionItems[${rowIndex}].name`}>
      {(field) => {
        return isEditingRow ? (
          <InputField
            autoFocus={isFirstEditRow}
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
