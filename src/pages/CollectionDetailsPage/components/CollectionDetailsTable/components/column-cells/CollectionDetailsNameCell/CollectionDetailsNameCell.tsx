import { useSelector } from '@tanstack/react-store';

import type { CreateOrUpdateCollectionItemFormTypeDef } from '#/pages/CollectionDetailsPage/CollectionDetailsPage.types';

import { InputField } from '#/components/Fields/InputField';
import { useEditingCollectionItemsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

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

  const name = useSelector(form.atom, ({ values }) => {
    return values.collectionItems[rowIndex].name;
  });

  return isEditingRow ? (
    <form.ArrayField name="collectionItems">
      {() => {
        return (
          <form.Field name={`collectionItems[${rowIndex}].name`}>
            {(field) => {
              return (
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
              );
            }}
          </form.Field>
        );
      }}
    </form.ArrayField>
  ) : (
    <p>{name}</p>
  );
};
