import AddIcon from '@mui/icons-material/Add';

import type { ButtonPropsDef } from '#/components/Button';
import type { CreateOrUpdateCollectionItemFormTypeDef } from '#/pages/CollectionDetailsPage/CollectionDetailsPage.types';

import { Button } from '#/components/Button';
import { useEditingCollectionItemsRowIds } from '#/pages/CollectionDetailsPage/hooks/use-editing-collection-items-row-ids';

import { useCreateNewCollectionItem } from '../../../../../../CollectionDetailsPage.form';

export const AddNewCollectionItemButton = ({
  form,
  insertAtIndex,
  ...buttonProps
}: ButtonPropsDef & {
  form: CreateOrUpdateCollectionItemFormTypeDef;
  insertAtIndex: number;
}) => {
  const { addToEditingRowIds } = useEditingCollectionItemsRowIds();

  const createNewCollectionItem = useCreateNewCollectionItem();

  return (
    <form.ArrayField name="collectionItems">
      {(collectionItemsField) => {
        return (
          <Button
            Icon={AddIcon}
            onClick={async () => {
              const newCollectionItem = await createNewCollectionItem();

              collectionItemsField.insertValue(
                insertAtIndex,
                newCollectionItem,
              );

              addToEditingRowIds(newCollectionItem.id);
            }}
            variant="secondary"
            {...buttonProps}
          />
        );
      }}
    </form.ArrayField>
  );
};
