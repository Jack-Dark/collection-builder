import AddIcon from '@mui/icons-material/Add';

import type { CreateOrUpdateCollectionItemFormTypeDef } from '#/pages/CollectionDetailsPage/CollectionDetailsPage.types';

import { Button } from '#/components/Button';
import { useEditingCollectionItemsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';
import { Route } from '#/routes/_protected/collections/$id';

import { createNewCollectionItem } from '../../../../../../CollectionDetailsPage.form';

export const AddNewCollectionItemButton = ({
  disabled,
  form,
  insertAtIndex,
  text,
}: {
  disabled: boolean;
  form: CreateOrUpdateCollectionItemFormTypeDef;
  insertAtIndex: number;
  text: string;
}) => {
  const { id } = Route.useParams();

  const { addToEditingRowIds } = useEditingCollectionItemsRowIds();

  return (
    <form.ArrayField name="collectionItems">
      {(collectionItemsField) => {
        return (
          <Button
            disabled={disabled}
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
            text={text}
            variant="secondary"
          />
        );
      }}
    </form.ArrayField>
  );
};
