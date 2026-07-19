import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import formatDate, { masks } from 'dateformat';

import { Button } from '#/components/Button';
import { useEditingCollectionItemsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';
import { Route } from '#/routes/_protected/collections/$id';

import {
  addCollectionItemFormDefaultValues,
  createNewCollectionItem,
  withCollectionDetailsForm,
} from '../../../CollectionDetailsPage.form';

export const CollectionDetailsCreatedAtCell = withCollectionDetailsForm({
  defaultValues: addCollectionItemFormDefaultValues,
  /** These values are only used for type-checking, and are not used at runtime */
  props: {
    index: 0,
    rowId: '',
    value: '',
  },
  render: ({ form, index, rowId, value }) => {
    const { getHasNewRecord, getIsEditingRowId } =
      useEditingCollectionItemsRowIds();
    const isEditingRow = getIsEditingRowId(rowId);

    const { getLastNewRecordIndex, removeFromIsEditingRowIds } =
      useEditingCollectionItemsRowIds();

    const isLastNewRecordIndex = getLastNewRecordIndex() === index;

    return isEditingRow && getHasNewRecord() ? (
      <form.AppField mode="array" name="collectionItems">
        {(collectionItemsField) => {
          return (
            <div className="grid gap-2 justify-start">
              <form.AppField name={`collectionItems[${index}]`}>
                {(field) => {
                  return (
                    <>
                      <Button
                        Icon={ClearIcon}
                        onClick={() => {
                          collectionItemsField.removeValue(index);
                          removeFromIsEditingRowIds(
                            String(field.state.value.id),
                          );
                        }}
                        text="Remove"
                        variant="mono"
                      />

                      {isLastNewRecordIndex && (
                        <form.Subscribe
                          selector={(state) => {
                            const { isFormValid, isPristine } = state;

                            return {
                              isFormValid,
                              isPristine,
                            };
                          }}
                        >
                          {({ isFormValid, isPristine }) => {
                            return (
                              <form.AppForm>
                                <AddNewCollectionItemButton
                                  disabled={isPristine || !isFormValid}
                                  form={form}
                                  insertAtIndex={index + 1}
                                  text="Another"
                                />
                              </form.AppForm>
                            );
                          }}
                        </form.Subscribe>
                      )}
                    </>
                  );
                }}
              </form.AppField>
            </div>
          );
        }}
      </form.AppField>
    ) : (
      <p>{formatDate(value, masks.paddedShortDate)}</p>
    );
  },
});

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

export const CollectionDetailsSubmitButton = withCollectionDetailsForm({
  /** These values are only used for type-checking, and are not used at runtime */
  defaultValues: addCollectionItemFormDefaultValues,
  render: ({ form }) => {
    return (
      <form.Subscribe
        selector={(state) => {
          const { isFormValid, isPristine } = state;

          return {
            isFormValid,
            isPristine,
          };
        }}
      >
        {({ isFormValid, isPristine }) => {
          return (
            <form.AppForm>
              <form.Button
                className="flex flex-nowrap gap-2"
                disabled={isPristine || !isFormValid}
                Icon={SaveIcon}
                text="Save"
                type="submit"
              />
            </form.AppForm>
          );
        }}
      </form.Subscribe>
    );
  },
});
