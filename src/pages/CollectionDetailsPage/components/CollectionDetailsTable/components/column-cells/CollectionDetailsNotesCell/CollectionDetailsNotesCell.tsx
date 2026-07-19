import { getFieldError } from '#/helpers/get-field-error';
import {
  withCollectionDetailsForm,
  collectionDetailsFormDefaultValues,
} from '#/pages/CollectionDetailsPage/CollectionDetailsPage.form';
import { useEditingCollectionItemsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

export const CollectionDetailsNotesCell = withCollectionDetailsForm({
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
            <form.AppField name={`collectionItems[${index}].notes`}>
              {(field) => {
                return (
                  <field.TextAreaField
                    error={getFieldError(field)}
                    name={field.name}
                    onValueChange={field.handleChange}
                    placeholder="Input notes..."
                    value={field.state.value}
                  />
                );
              }}
            </form.AppField>
          );
        }}
      </form.AppField>
    ) : (
      <p>{value || '-'}</p>
    );
  },
});
