import { Popover } from '#/components/Popover';
import { getFieldError } from '#/helpers/get-field-error';
import {
  withCollectionDetailsForm,
  addCollectionItemFormDefaultValues,
} from '#/pages/CollectionDetailsPage/CollectionDetailsPage.form';
import { useEditingCollectionItemsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

export const CollectionDetailsCustomFieldCell = withCollectionDetailsForm({
  defaultValues: addCollectionItemFormDefaultValues,
  /** These values are only used for type-checking, and are not used at runtime */
  props: {
    addToCustomFieldValues: (_value: string) => {},
    fieldName: '',
    fieldValues: [''],
    index: 0,
    label: '',
    rowId: '',
    value: '',
  },
  render: (props) => {
    const {
      addToCustomFieldValues,
      fieldName,
      fieldValues,
      form,
      index,
      label,
      rowId,
      value,
    } = props;

    const customFieldName = fieldName as `customField${1 | 2 | 3}Value`;

    const { getIsEditingRowId } = useEditingCollectionItemsRowIds();

    const isEditingRow = getIsEditingRowId(rowId);

    return isEditingRow ? (
      <form.AppField mode="array" name="collectionItems">
        {() => {
          return (
            <form.AppField
              name={`collectionItems[${index}].${customFieldName}`}
            >
              {(field) => {
                return (
                  <div className="flex gap-1 items-center">
                    <field.ComboboxField
                      createCreatable={(query) => {
                        return query;
                      }}
                      error={getFieldError(field)}
                      hideLabel
                      inputValue={field.state.value}
                      isItemEqualToValue={(item, value) => {
                        return item === value;
                      }}
                      items={fieldValues}
                      label={label}
                      onValueChange={(value) => {
                        const stringValue = value || '';
                        field.setValue(stringValue);

                        if (stringValue && !fieldValues.includes(stringValue)) {
                          addToCustomFieldValues(stringValue);
                        }
                      }}
                      placeholder={`${label || ''}...`}
                      required
                    />
                    <Popover
                      Description={`Want to add a new item to the list? Just type it out and click on the "Add" option.`}
                    />
                  </div>
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
