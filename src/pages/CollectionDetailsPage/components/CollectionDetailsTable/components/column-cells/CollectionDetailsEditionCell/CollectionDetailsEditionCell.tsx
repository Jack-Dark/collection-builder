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

  const editionDetails = useSelector(form.atom, ({ values }) => {
    return values.collectionItems[rowIndex].editionDetails;
  });

  return isEditingRow ? (
    <form.ArrayField name="collectionItems">
      {() => {
        return (
          <div className="grid gap-2">
            <form.Field name={`collectionItems[${rowIndex}].isSpecialEdition`}>
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

            <form.Field name={`collectionItems[${rowIndex}].editionDetails`}>
              {({ errors, handleChange, name, value }) => {
                return (
                  <form.Subscribe
                    selector={(state) => {
                      return {
                        isSpecialEdition:
                          state.values.collectionItems[rowIndex]
                            .isSpecialEdition,
                      };
                    }}
                  >
                    {({ isSpecialEdition }) => {
                      return (
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
                      );
                    }}
                  </form.Subscribe>
                );
              }}
            </form.Field>
          </div>
        );
      }}
    </form.ArrayField>
  ) : (
    <p>{editionDetails || '-'}</p>
  );
};
