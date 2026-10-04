import type { CreateOrUpdateCollectionItemFormTypeDef } from '#/pages/CollectionDetailsPage/CollectionDetailsPage.types';

import { TextAreaField } from '#/components/Fields/TextAreaField';
import { useEditingCollectionItemsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

export const CollectionDetailsNotesCell = (props: {
  form: CreateOrUpdateCollectionItemFormTypeDef;
  index: number;
  rowId: string;
  value: string;
}) => {
  const { form, index, rowId, value } = props;

  const { getIsEditingRowId } = useEditingCollectionItemsRowIds();
  const isEditingRow = getIsEditingRowId(rowId);

  return isEditingRow ? (
    <form.ArrayField name="collectionItems">
      {() => {
        return (
          <form.Field name={`collectionItems[${index}].notes`}>
            {({ errors, handleChange, name, value }) => {
              return (
                <TextAreaField
                  error={errors}
                  name={name}
                  onValueChange={(value) => {
                    handleChange(value);
                  }}
                  placeholder="Input notes..."
                  value={value}
                />
              );
            }}
          </form.Field>
        );
      }}
    </form.ArrayField>
  ) : (
    <p>{value || '-'}</p>
  );
};
