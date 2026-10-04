import type { CreateOrUpdateCollectionItemFormTypeDef } from '#/pages/CollectionDetailsPage/CollectionDetailsPage.types';

import { useEditingCollectionItemsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

export const CollectionDetailsCustomFieldCell = (props: {
  addToCustomFieldValues: (value: string) => void;
  fieldName: string;
  fieldValues: string[];
  form: CreateOrUpdateCollectionItemFormTypeDef;
  index: number;
  label: string;
  rowId: string;
  value: string;
}) => {
  const {
    addToCustomFieldValues,
    fieldName,
    fieldValues,
    form,
    index,
    label,
    rowId,
    value,
  } = props;

  const customFieldName = fieldName as `customField${1 | 2 | 3}Value`;

  const { getIsEditingRowId } = useEditingCollectionItemsRowIds();

  const isEditingRow = getIsEditingRowId(rowId);

  return <p>{value || '-'}</p>;
};
