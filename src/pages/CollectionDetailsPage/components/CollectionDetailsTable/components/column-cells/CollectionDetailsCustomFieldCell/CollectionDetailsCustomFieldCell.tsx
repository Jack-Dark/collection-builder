import type { CreateOrUpdateCollectionItemFormTypeDef } from '#/pages/CollectionDetailsPage/CollectionDetailsPage.types';

import { ComboboxField } from '#/components/Fields/ComboboxField';
import { Popover } from '#/components/Popover';
import { useEditingCollectionItemsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

export const CollectionDetailsCustomFieldCell = (props: {
  addToCustomFieldValues: (_value: string) => {};
  fieldName: string;
  fieldValues: string[];
  form: CreateOrUpdateCollectionItemFormTypeDef;
  index: number;
  label: string;
  rowId: string;
  value: string;
}) => {
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
    <form.ArrayField name="collectionItems">
      {() => {
        return (
          <form.Field name={`collectionItems[${index}].${customFieldName}`}>
            {(field) => {
              return (
                <div className="flex gap-1 items-center">
                  <ComboboxField
                    createItem={(query) => {
                      return query;
                    }}
                    error={field.errors}
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
          </form.Field>
        );
      }}
    </form.ArrayField>
  ) : (
    <p>{value || '-'}</p>
  );
};
