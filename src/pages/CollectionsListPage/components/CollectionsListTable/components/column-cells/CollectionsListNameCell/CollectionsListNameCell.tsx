import { Link } from '@tanstack/react-router';

import {
  withCollectionsListForm,
  collectionsListFormDefaultValues,
} from '#/pages/CollectionsListPage/CollectionsListPage.form';
import { useEditingCollectionsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

export const CollectionsListNameCell = withCollectionsListForm({
  /** These values are only used for type-checking, and are not used at runtime */
  defaultValues: collectionsListFormDefaultValues,
  props: {
    index: 0,
    rowId: '',
    value: '',
  },
  render: ({ form, index, rowId, value }) => {
    const { getIsEditingRowId } = useEditingCollectionsRowIds();
    const isEditingRow = getIsEditingRowId(rowId);

    return isEditingRow ? (
      <form.AppField mode="array" name="records">
        {() => {
          return (
            <form.AppField name={`records[${index}].name`}>
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
      <Link
        className="hover:text-primary-700"
        params={{ id: rowId }}
        to="/collections/$id"
      >
        <p>{value}</p>
      </Link>
    );
  },
});
