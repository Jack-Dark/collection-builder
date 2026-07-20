import { getFieldError } from '#/helpers/get-field-error';
import {
  withCollectionsListForm,
  collectionsListFormDefaultValues,
} from '#/pages/CollectionsListPage/CollectionsListPage.form';
import { useEditingCollectionsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

export const CollectionsListCustomFieldCell = withCollectionsListForm({
  defaultValues: collectionsListFormDefaultValues,
  /** These values are only used for type-checking, and are not used at runtime */
  props: {
    enabledFieldName: '',
    index: 0,
    label: '',
    labelFieldName: '',
    rowId: '',
    value: '',
  },
  render: (props) => {
    const {
      enabledFieldName,
      form,
      index,
      label,
      labelFieldName,
      rowId,
      value,
    } = props;

    const customFieldEnabledFieldName =
      enabledFieldName as `customField${1 | 2 | 3}Enabled`;
    const customFieldLabelFieldName =
      labelFieldName as `customField${1 | 2 | 3}Label`;

    const { getIsEditingRowId } = useEditingCollectionsRowIds();

    const isEditingRow = getIsEditingRowId(rowId);

    return isEditingRow ? (
      <form.AppField mode="array" name="records">
        {() => {
          return (
            <div className="grid gap-2">
              <form.AppField
                name={`records[${index}].${customFieldEnabledFieldName}`}
              >
                {(field) => {
                  return (
                    <div className="flex gap-1 items-center">
                      <field.SwitchField
                        checked={field.state.value}
                        error={getFieldError(field)}
                        label="Enabled"
                        onCheckedChange={(value) => {
                          field.setValue(value);
                        }}
                      />
                    </div>
                  );
                }}
              </form.AppField>

              <form.AppField
                name={`records[${index}].${customFieldLabelFieldName}`}
              >
                {(field) => {
                  return (
                    <div className="flex gap-1 items-center">
                      <field.InputField
                        error={getFieldError(field)}
                        hideLabel
                        label={label}
                        onValueChange={field.setValue}
                        placeholder="Input label..."
                        value={field.state.value || ''}
                      />
                    </div>
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
