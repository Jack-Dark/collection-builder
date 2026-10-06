import ClearIcon from '@mui/icons-material/Clear';
import { useSelector } from '@tanstack/react-store';
import formatDate, { masks } from 'dateformat';

import type { CreateOrUpdateCollectionItemFormTypeDef } from '#/pages/CollectionDetailsPage/CollectionDetailsPage.types';

import { Button } from '#/components/Button';
import { useEditingCollectionItemsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

import { AddNewCollectionItemButton } from '../../CollectionDetailsTableRowActions/components/AddNewCollectionItemButton';

export const CollectionDetailsCreatedAtCell = ({
  form,
  rowId,
  rowIndex,
}: {
  form: CreateOrUpdateCollectionItemFormTypeDef;
  rowId: string;
  rowIndex: number;
}) => {
  const { getHasNewRecord, getIsEditingRowId } =
    useEditingCollectionItemsRowIds();
  const isEditingRow = getIsEditingRowId(rowId);

  const { getLastNewRecordIndex, removeFromIsEditingRowIds } =
    useEditingCollectionItemsRowIds();

  const isLastNewRecordIndex = getLastNewRecordIndex() === rowIndex;

  const createdAt = useSelector(form.atom, ({ values }) => {
    return values.collectionItems[rowIndex].createdAt;
  });

  return isEditingRow && getHasNewRecord() ? (
    <form.ArrayField name="collectionItems">
      {(collectionItemsField) => {
        return (
          <div className="grid gap-2 justify-start">
            <form.Field name={`collectionItems[${rowIndex}]`}>
              {({ value }) => {
                return (
                  <>
                    <Button
                      Icon={ClearIcon}
                      onClick={() => {
                        collectionItemsField.removeValue(rowIndex);
                        removeFromIsEditingRowIds(String(value.id));
                      }}
                      text="Remove"
                      variant="mono"
                    />

                    {isLastNewRecordIndex && (
                      <form.Subscribe
                        selector={(state) => {
                          const { isPristine, isValid } = state;

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
                              <AddNewCollectionItemButton
                                disabled={isPristine || !isValid}
                                form={form}
                                insertAtIndex={rowIndex + 1}
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
    <p>{formatDate(createdAt, masks.paddedShortDate)}</p>
  );
};
