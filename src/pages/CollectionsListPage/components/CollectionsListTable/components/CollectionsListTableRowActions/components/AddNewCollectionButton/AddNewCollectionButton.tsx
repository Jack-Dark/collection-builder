import AddIcon from '@mui/icons-material/Add';

import type { CreateOrUpdateCollectionFormTypeDef } from '#/pages/CollectionsListPage/CollectionsListPage.types';

import { Button } from '#/components/Button';
import { createNewCollection } from '#/pages/CollectionsListPage/CollectionsListPage.form';
import { useEditingCollectionsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

export const AddNewCollectionButton = (props: {
  disabled: boolean;
  form: CreateOrUpdateCollectionFormTypeDef;
  insertAtIndex: number;
  text: string;
}) => {
  const { disabled, form, insertAtIndex, text } = props;

  const { addToEditingRowIds } = useEditingCollectionsRowIds();

  return (
    <form.ArrayField name="records">
      {(recordsField) => {
        return (
          <Button
            disabled={disabled}
            Icon={AddIcon}
            onClick={() => {
              const newCollectionItem = createNewCollection();

              recordsField.insertValue(insertAtIndex, newCollectionItem);

              addToEditingRowIds(newCollectionItem.id);
            }}
            text={text}
            variant="secondary"
          />
        );
      }}
    </form.ArrayField>
  );
};
