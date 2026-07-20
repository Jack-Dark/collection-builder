import { getFieldError } from '#/helpers/get-field-error';
import {
  withCollectionsListForm,
  collectionsListFormDefaultValues,
} from '#/pages/CollectionsListPage/CollectionsListPage.form';
import { useEditingCollectionsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

export const CollectionsListNotesCell = withCollectionsListForm({
  defaultValues: collectionsListFormDefaultValues,
  /** These values are only used for type-checking, and are not used at runtime */
  props: {
    index: 0,
    rowId: '',
    value: '',
  },
  render: (props) => {
    const { form, index, rowId, value } = props;

    const { getIsEditingRowId } = useEditingCollectionsRowIds();
    const isEditingRow = getIsEditingRowId(rowId);

    return isEditingRow ? (
      <form.AppField mode="array" name="records">
        {() => {
          return (
            <form.AppField name={`records[${index}].notes`}>
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
