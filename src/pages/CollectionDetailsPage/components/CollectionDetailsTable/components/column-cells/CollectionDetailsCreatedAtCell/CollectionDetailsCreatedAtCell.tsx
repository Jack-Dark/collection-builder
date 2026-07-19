import ClearIcon from '@mui/icons-material/Clear';
import formatDate, { masks } from 'dateformat';

import { Button } from '#/components/Button';
import { useEditingCollectionItemsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

import {
  collectionDetailsFormDefaultValues,
  withCollectionDetailsForm,
} from '../../../../../CollectionDetailsPage.form';
import { AddNewCollectionItemButton } from '../../CollectionDetailsTableRowActions/components/AddNewCollectionItemButton';

export const CollectionDetailsCreatedAtCell = withCollectionDetailsForm({
  defaultValues: collectionDetailsFormDefaultValues,
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
