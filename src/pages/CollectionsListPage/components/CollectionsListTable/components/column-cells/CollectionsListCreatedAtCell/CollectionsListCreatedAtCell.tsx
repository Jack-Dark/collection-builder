import ClearIcon from '@mui/icons-material/Clear';
import formatDate, { masks } from 'dateformat';

import { Button } from '#/components/Button';
import { useEditingCollectionsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

import {
  collectionsListFormDefaultValues,
  withCollectionsListForm,
} from '../../../../../CollectionsListPage.form';
import { AddNewCollectionButton } from '../../CollectionsListTableRowActions/components/AddNewCollectionButton';

export const CollectionsListCreatedAtCell = withCollectionsListForm({
  defaultValues: collectionsListFormDefaultValues,
  /** These values are only used for type-checking, and are not used at runtime */
  props: {
    index: 0,
    rowId: '',
    value: '',
  },
  render: ({ form, index, rowId, value }) => {
    const { getHasNewRecord, getIsEditingRowId } =
      useEditingCollectionsRowIds();
    const isEditingRow = getIsEditingRowId(rowId);

    const { getLastNewRecordIndex, removeFromIsEditingRowIds } =
      useEditingCollectionsRowIds();

    const isLastNewRecordIndex = getLastNewRecordIndex() === index;

    return isEditingRow && getHasNewRecord() ? (
      <form.AppField mode="array" name="records">
        {(recordsField) => {
          return (
            <div className="grid gap-2 justify-start">
              <form.AppField name={`records[${index}]`}>
                {(field) => {
                  return (
                    <>
                      <Button
                        Icon={ClearIcon}
                        onClick={() => {
                          recordsField.removeValue(index);
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
                                <AddNewCollectionButton
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
