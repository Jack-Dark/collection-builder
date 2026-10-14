import { useSelector } from '@tanstack/react-store';

import type { CreateOrUpdateCollectionItemFormTypeDef } from '#/pages/CollectionDetailsPage/CollectionDetailsPage.types';

import { SwitchField } from '#/components/Fields/SwitchField';
import { TextAreaField } from '#/components/Fields/TextAreaField';
import { useEditingCollectionItemsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

export const CollectionDetailsEditionCell = (props: {
  form: CreateOrUpdateCollectionItemFormTypeDef;
  rowId: string;
  rowIndex: number;
}) => {
  const { form, rowId, rowIndex } = props;

  const { getIsEditingRowId } = useEditingCollectionItemsRowIds();
  const isEditingRow = getIsEditingRowId(rowId);

  const isSpecialEdition = useSelector(form.atom, ({ values }) => {
    return values.collectionItems[rowIndex].isSpecialEdition;
  });

  return (
    <form.ArrayField name="collectionItems">
      {() => {
        return (
          <div className="grid gap-2">
            {isEditingRow && (
              <form.Field
                name={`collectionItems[${rowIndex}].isSpecialEdition`}
              >
                {({ errors, handleChange, value }) => {
                  return (
                    <SwitchField
                      checked={value}
                      error={errors}
                      label="Special edition"
                      onCheckedChange={(checked) => {
                        handleChange(checked);
                        form.setFieldValue(
                          `collectionItems[${rowIndex}].editionDetails`,
                          checked ? "Collector's Edition" : '',
                        );
                      }}
                    />
                  );
                }}
              </form.Field>
            )}

            <form.Field name={`collectionItems[${rowIndex}].editionDetails`}>
              {({ errors, handleChange, name, value }) => {
                return isEditingRow ? (
                  isSpecialEdition && (
                    <TextAreaField
                      error={errors}
                      name={name}
                      onValueChange={(value) => {
                        return handleChange(value);
                      }}
                      required
                      value={value}
                    />
                  )
                ) : (
                  <p>{value || '-'}</p>
                );
              }}
            </form.Field>
          </div>
        );
      }}
    </form.ArrayField>
  );
};
