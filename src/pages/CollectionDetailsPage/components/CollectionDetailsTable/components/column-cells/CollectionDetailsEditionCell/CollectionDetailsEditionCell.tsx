import { getFieldError } from '#/helpers/get-field-error';
import {
  withCollectionDetailsForm,
  collectionDetailsFormDefaultValues,
} from '#/pages/CollectionDetailsPage/CollectionDetailsPage.form';
import { useEditingCollectionItemsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

export const CollectionDetailsEditionCell = withCollectionDetailsForm({
  defaultValues: collectionDetailsFormDefaultValues,
  /** These values are only used for type-checking, and are not used at runtime */
  props: {
    index: 0,
    rowId: '',
    value: '',
  },
  render: (props) => {
    const { form, index, rowId, value } = props;
    const { getIsEditingRowId } = useEditingCollectionItemsRowIds();
    const isEditingRow = getIsEditingRowId(rowId);

    return isEditingRow ? (
      <form.AppField mode="array" name="collectionItems">
        {() => {
          return (
            <div className="grid gap-2">
              <form.AppField
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
                    <field.SwitchField
                      checked={field.state.value}
                      error={getFieldError(field)}
                      label="Special edition"
                      onCheckedChange={field.handleChange}
                    />
                  );
                }}
              </form.AppField>

              <form.AppField name={`collectionItems[${index}].editionDetails`}>
                {(field) => {
                  return (
                    <form.Subscribe
                      selector={(state) => {
                        return {
                          isSpecialEdition:
                            state.values.collectionItems[index]
                              .isSpecialEdition,
                        };
                      }}
                    >
                      {({ isSpecialEdition }) => {
                        return (
                          isSpecialEdition && (
                            <field.TextAreaField
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
              </form.AppField>
            </div>
          );
        }}
      </form.AppField>
    ) : (
      <p>{value || '-'}</p>
    );
  },
});
