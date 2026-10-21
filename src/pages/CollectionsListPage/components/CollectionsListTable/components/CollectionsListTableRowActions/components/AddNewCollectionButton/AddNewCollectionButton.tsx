import AddIcon from '@mui/icons-material/Add';

import type { ButtonPropsDef } from '#/components/Button';
import type { CreateOrUpdateCollectionFormTypeDef } from '#/pages/CollectionsListPage/CollectionsListPage.types';

import { Button } from '#/components/Button';
import { createNewCollection } from '#/pages/CollectionsListPage/CollectionsListPage.form';
import { useEditingCollectionsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

export const AddNewCollectionButton = (
  props: {
    form: CreateOrUpdateCollectionFormTypeDef;
    insertAtIndex: number;
  } & ButtonPropsDef,
) => {
  const { form, insertAtIndex, ...buttonProps } = props;

  const { addToEditingRowIds } = useEditingCollectionsRowIds();

  return (
    <form.ArrayField name="records">
      {(recordsField) => {
        return (
          <Button
            {...buttonProps}
            Icon={AddIcon}
            onClick={() => {
              const newCollectionItem = createNewCollection();

              recordsField.insertValue(insertAtIndex, newCollectionItem);

              addToEditingRowIds(newCollectionItem.id);
            }}

            variant="secondary"
          />
        );
      }}
    </form.ArrayField>
  );
};
