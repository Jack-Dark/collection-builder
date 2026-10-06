import { useSelector } from '@tanstack/react-store';

import type { CreateOrUpdateCollectionItemFormTypeDef } from '#/pages/CollectionDetailsPage/CollectionDetailsPage.types';

import { TextAreaField } from '#/components/Fields/TextAreaField';
import { useEditingCollectionItemsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

export const CollectionDetailsNotesCell = (props: {
  form: CreateOrUpdateCollectionItemFormTypeDef;
  rowId: string;
  rowIndex: number;
}) => {
  const { form, rowId, rowIndex } = props;

  const { getIsEditingRowId } = useEditingCollectionItemsRowIds();
  const isEditingRow = getIsEditingRowId(rowId);

  const notes = useSelector(form.atom, ({ values }) => {
    return values.collectionItems[rowIndex].notes;
  });

  return isEditingRow ? (
    <form.Field name={`collectionItems[${rowIndex}].notes`}>
      {({ errors, handleChange, name }) => {
        return (
          <TextAreaField
            error={errors}
            name={name}
            onValueChange={(value) => {
              handleChange(value);
            }}
            placeholder="Input notes..."
            value={notes}
          />
        );
      }}
    </form.Field>
  ) : (
    <p>{notes || '-'}</p>
  );
};
