import ClearIcon from '@mui/icons-material/Clear';
import formatDate, { masks } from 'dateformat';

import type { CreateOrUpdateCollectionFormTypeDef } from '#/pages/CollectionsListPage/CollectionsListPage.types';

import { Button } from '#/components/Button';
import { useEditingCollectionsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

import { AddNewCollectionButton } from '../../CollectionsListTableRowActions/components/AddNewCollectionButton';

export const CollectionsListCreatedAtCell = (props: {
  form: CreateOrUpdateCollectionFormTypeDef;
  index: number;
  rowId: string;
  value: string;
}) => {
  const { form, index, rowId, value } = props;

  const { getHasNewRecord, getIsEditingRowId } = useEditingCollectionsRowIds();
  const isEditingRow = getIsEditingRowId(rowId);

  const { getLastNewRecordIndex, removeFromIsEditingRowIds } =
    useEditingCollectionsRowIds();

  const isLastNewRecordIndex = getLastNewRecordIndex() === index;

  return isEditingRow && getHasNewRecord() ? (
    <form.ArrayField name="records">
      {(recordsField) => {
        return (
          <div className="grid gap-2 justify-start">
            <form.Field name={`records[${index}]`}>
              {() => {
                return (
                  <>
                    <Button
                      Icon={ClearIcon}
                      onClick={() => {
                        recordsField.removeValue(index);
                        removeFromIsEditingRowIds(rowId);
                      }}
                      text="Remove"
                      variant="mono"
                    />

                    {isLastNewRecordIndex && (
                      <form.Subscribe
                        selector={({ isPristine, isValid }) => {
                          return {
                            isPristine,
                            isValid,
                          };
                        }}
                      >
                        {({ isPristine, isValid }) => {
                          return (
                            <>
                              {/* <form.AppForm> */}
                              <AddNewCollectionButton
                                disabled={isPristine || !isValid}
                                form={form}
                                insertAtIndex={index + 1}
                                text="Another"
                              />
                              {/* </form.AppForm> */}
                            </>
                          );
                        }}
                      </form.Subscribe>
                    )}
                  </>
                );
              }}
            </form.Field>
          </div>
        );
      }}
    </form.ArrayField>
  ) : (
    <p>{formatDate(value, masks.paddedShortDate)}</p>
  );
};
