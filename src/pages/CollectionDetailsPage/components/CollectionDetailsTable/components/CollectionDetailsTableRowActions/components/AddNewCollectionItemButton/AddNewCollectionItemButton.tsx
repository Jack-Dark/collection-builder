import AddIcon from '@mui/icons-material/Add';

import { Button } from '#/components/Button';
import { useEditingCollectionItemsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';
import { Route } from '#/routes/_protected/collections/$id';

import {
  addCollectionItemFormDefaultValues,
  createNewCollectionItem,
  withCollectionDetailsForm,
} from '../../../../../../CollectionDetailsPage.form';

export const AddNewCollectionItemButton = withCollectionDetailsForm({
  /** These values are only used for type-checking, and are not used at runtime */
  defaultValues: addCollectionItemFormDefaultValues,
  props: {
    disabled: false,
    insertAtIndex: 0,
    text: '',
  },
  render: ({ disabled, form, insertAtIndex, text }) => {
    const { id } = Route.useParams();

    const { addToEditingRowIds } = useEditingCollectionItemsRowIds();

    return (
      <form.AppField mode="array" name="collectionItems">
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
      </form.AppField>
    );
  },
});
