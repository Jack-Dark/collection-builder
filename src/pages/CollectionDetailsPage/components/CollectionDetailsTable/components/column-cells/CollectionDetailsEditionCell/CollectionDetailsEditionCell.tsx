import type { CreateOrUpdateCollectionItemFormTypeDef } from '#/pages/CollectionDetailsPage/CollectionDetailsPage.types';

import { SwitchField } from '#/components/Fields/SwitchField';
import { TextAreaField } from '#/components/Fields/TextAreaField';
import { getFieldError } from '#/helpers/get-field-error';
import { useEditingCollectionItemsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

export const CollectionDetailsEditionCell = (props: {
  form: CreateOrUpdateCollectionItemFormTypeDef;
  index: number;
  rowId: string;
  value: string;
}) => {
  const { form, index, rowId, value } = props;
  const { getIsEditingRowId } = useEditingCollectionItemsRowIds();
  const isEditingRow = getIsEditingRowId(rowId);

  return isEditingRow ? (
    <form.ArrayField name="collectionItems">
      {() => {
        return (
          <div className="grid gap-2">
            <form.Field
              listeners={{
                onChange: ({ value: isSpecialEdition }) => {
                  form.setFieldValue(
                    `collectionItems[${index}].editionDetails`,
                    isSpecialEdition ? "Collector's Edition" : '',
                  );
                },
              }}
              name={`collectionItems[${index}].isSpecialEdition`}
            >
              {(field) => {
                return (
                  <SwitchField
                    checked={field.state.value}
                    error={getFieldError(field)}
                    label="Special edition"
                    onCheckedChange={field.handleChange}
                  />
                );
              }}
            </form.Field>

            <form.Field name={`collectionItems[${index}].editionDetails`}>
              {(field) => {
                return (
                  <form.Subscribe
                    selector={(state) => {
                      return {
                        isSpecialEdition:
                          state.values.collectionItems[index].isSpecialEdition,
                      };
                    }}
                  >
                    {({ isSpecialEdition }) => {
                      return (
                        isSpecialEdition && (
                          <TextAreaField
                            error={getFieldError(field)}
                            name={field.name}
                            onValueChange={field.handleChange}
                            required
                            value={field.state.value}
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
    <p>{value || '-'}</p>
  );
};
