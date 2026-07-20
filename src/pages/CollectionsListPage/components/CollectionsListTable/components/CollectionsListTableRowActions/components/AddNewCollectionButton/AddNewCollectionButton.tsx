import AddIcon from '@mui/icons-material/Add';

import { Button } from '#/components/Button';
import {
  collectionsListFormDefaultValues,
  createNewCollection,
  withCollectionsListForm,
} from '#/pages/CollectionsListPage/CollectionsListPage.form';
import { useEditingCollectionsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

export const AddNewCollectionButton = withCollectionsListForm({
  /** These values are only used for type-checking, and are not used at runtime */
  defaultValues: collectionsListFormDefaultValues,
  props: {
    disabled: false,
    insertAtIndex: 0,
    text: '',
  },
  render: ({ disabled, form, insertAtIndex, text }) => {
    const { addToEditingRowIds } = useEditingCollectionsRowIds();

    return (
      <form.AppField mode="array" name="records">
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
      </form.AppField>
    );
  },
});
