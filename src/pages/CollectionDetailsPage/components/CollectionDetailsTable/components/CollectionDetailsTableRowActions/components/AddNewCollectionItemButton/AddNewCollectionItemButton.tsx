import AddIcon from '@mui/icons-material/Add';

import type { ButtonPropsDef } from '#/components/Button';
import type { CreateOrUpdateCollectionItemFormTypeDef } from '#/pages/CollectionDetailsPage/CollectionDetailsPage.types';

import { Button } from '#/components/Button';
import { useEditingCollectionItemsRowIds } from '#/pages/CollectionDetailsPage/hooks/use-editing-collection-items-row-ids';
import { Route } from '#/routes/_protected/collections/$id';

import { createNewCollectionItem } from '../../../../../../CollectionDetailsPage.form';

export const AddNewCollectionItemButton = ({
  form,
  insertAtIndex,
  ...buttonProps
}: ButtonPropsDef & {
  form: CreateOrUpdateCollectionItemFormTypeDef;
  insertAtIndex: number;
}) => {
  const { id } = Route.useParams();

  const { addToEditingRowIds } = useEditingCollectionItemsRowIds();

  return (
    <form.ArrayField name="collectionItems">
      {(collectionItemsField) => {
        return (
          <Button
            Icon={AddIcon}
            onClick={() => {
              const newCollectionItem = createNewCollectionItem({
                collectionId: Number(id),
              });

              collectionItemsField.insertValue(
                insertAtIndex,
                newCollectionItem,
              );

              addToEditingRowIds(newCollectionItem.id);
            }}
            variant="primary"
            {...buttonProps}
          />
        );
      }}
    </form.ArrayField>
  );
};
