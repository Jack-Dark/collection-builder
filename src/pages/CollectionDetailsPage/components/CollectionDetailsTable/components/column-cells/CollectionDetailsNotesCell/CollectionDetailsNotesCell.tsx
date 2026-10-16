import type { CreateOrUpdateCollectionItemFormTypeDef } from '#/pages/CollectionDetailsPage/CollectionDetailsPage.types';

import { TextAreaField } from '#/components/Fields/TextAreaField';
import { useEditingCollectionItemsRowIds } from '#/pages/CollectionDetailsPage/hooks/use-editing-collection-items-row-ids';

export const CollectionDetailsNotesCell = (props: {
  form: CreateOrUpdateCollectionItemFormTypeDef;
  rowId: string;
  rowIndex: number;
}) => {
  const { form, rowId, rowIndex } = props;

  const { getIsEditingRowId } = useEditingCollectionItemsRowIds();
  const isEditingRow = getIsEditingRowId(rowId);

  return (
    <form.Field name={`collectionItems[${rowIndex}].notes`}>
      {(field) => {
        return isEditingRow ? (
          <TextAreaField
            error={field.errors}
            name={field.name}
            onValueChange={(value) => {
              field.handleChange(value);
            }}
            placeholder="Input notes..."
            value={field.value}
          />
        ) : (
          <p>{field.value || '-'}</p>
        );
      }}
    </form.Field>
  );
};
