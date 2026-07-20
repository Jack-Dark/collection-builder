import {
  withCollectionDetailsForm,
  collectionDetailsFormDefaultValues,
} from '#/pages/CollectionDetailsPage/CollectionDetailsPage.form';
import { useEditingCollectionItemsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

export const CollectionDetailsNameCell = withCollectionDetailsForm({
  /** These values are only used for type-checking, and are not used at runtime */
  defaultValues: collectionDetailsFormDefaultValues,
  props: {
    index: 0,
    rowId: '',
    value: '',
  },
  render: ({ form, index, rowId, value }) => {
    const { getIsEditingRowId } = useEditingCollectionItemsRowIds();
    const isEditingRow = getIsEditingRowId(rowId);

    return isEditingRow ? (
      <form.AppField mode="array" name="collectionItems">
        {() => {
          return (
            <form.AppField name={`collectionItems[${index}].name`}>
              {(field) => {
                return (
                  <field.InputField
                    autoFocus
                    // error={getFieldError(field)}
                    hideLabel
                    name={field.name}
                    onValueChange={field.handleChange}
                    placeholder="Input name..."
                    required
                    value={field.state.value}
                  />
                );
              }}
            </form.AppField>
          );
        }}
      </form.AppField>
    ) : (
      <p>{value}</p>
    );
  },
});
