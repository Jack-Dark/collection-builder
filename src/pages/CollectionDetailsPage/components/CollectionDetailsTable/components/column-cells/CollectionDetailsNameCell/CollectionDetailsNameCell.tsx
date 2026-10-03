import type { CreateOrUpdateCollectionItemFormTypeDef } from '#/pages/CollectionDetailsPage/CollectionDetailsPage.types';

import { InputField } from '#/components/Fields/InputField';
import { useEditingCollectionItemsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

export const CollectionDetailsNameCell = ({
  form,
  index,
  rowId,
  value,
}: {
  form: CreateOrUpdateCollectionItemFormTypeDef;
  index: number;
  rowId: string;
  value: string;
}) => {
  const { getIsEditingRowId } = useEditingCollectionItemsRowIds();
  const isEditingRow = getIsEditingRowId(rowId);

  return isEditingRow ? (
    <form.ArrayField name="collectionItems">
      {() => {
        return (
          <form.Field name={`collectionItems[${index}].name`}>
            {(field) => {
              return (
                <InputField
                  autoFocus
                  // error={getFieldError(field)}
                  hideLabel
                  name={field.name}
                  onValueChange={field.handleChange}
                  placeholder="Input name..."
                  required
                  value={field.state.value}
                />
              );
            }}
          </form.Field>
        );
      }}
    </form.ArrayField>
  ) : (
    <p>{value}</p>
  );
};
