import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { Fragment } from 'react/jsx-runtime';
import { v4 as uuidv4 } from 'uuid';

import type { CustomFieldTypeDef } from '#/api/db-tables-schema.types';
import type { CustomFieldValueDef } from '#/api/routes/custom-field-values/custom-field-values.types';

import { useCreateCustomFieldValues } from '#/api/routes/custom-field-values/create-custom-field-value/create-custom-field-value.react-query';
import {
  useGetCustomFieldValuesByCustomFieldId,
  useInvalidateGetCustomFieldValuesByCustomFieldId,
} from '#/api/routes/custom-field-values/get-custom-field-values-by-collection-id/get-custom-field-values-by-collection-id.react-query';
import { Button } from '#/components/Button';
import { useDialog } from '#/components/Dialog/hooks/useDialog';
import { CheckboxField } from '#/components/Fields/CheckboxField';
import { ComboboxField } from '#/components/Fields/ComboboxField';
import { InputField } from '#/components/Fields/InputField';
import { useEditingCollectionItemsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

import type {
  CreateOrUpdateCollectionItemFormDataDef,
  CreateOrUpdateCollectionItemFormRowDataDef,
  CreateOrUpdateCollectionItemFormTypeDef,
} from '../../../../../CollectionDetailsPage.types';

import { DeleteCustomFieldValueDialog } from './components/DeleteCustomFieldValueDialog';

export const CollectionDetailsCustomFieldCell = ({
  collectionItemId,
  customField,
  customFieldValue,
  form,
  rowId,
  rowIndex,
}: {
  collectionItemId: number | string;
  customField: {
    id: number;
    name: string;
    type: CustomFieldTypeDef;
  };
  customFieldValue: CreateOrUpdateCollectionItemFormRowDataDef['customFieldValues'][number];
  form: CreateOrUpdateCollectionItemFormTypeDef;
  rowId: string;
  rowIndex: number;
}) => {
  const { data: customFieldValuesForColumn } =
    useGetCustomFieldValuesByCustomFieldId({
      placeholderData: [],
      requestArgs: {
        id: customField.id,
      },
    });

  const invalidateGetCustomFieldValuesByCustomFieldId =
    useInvalidateGetCustomFieldValuesByCustomFieldId();

  const { getIsEditingRowId } = useEditingCollectionItemsRowIds();

  const isEditingRow = getIsEditingRowId(rowId);

  const customFieldValueForIndex = customFieldValue;

  const key = customFieldValueForIndex?.id || customField.id;

  const { onCreateCustomFieldValues, processing } = useCreateCustomFieldValues({
    onSuccess: () => {
      invalidateGetCustomFieldValuesByCustomFieldId({
        id: customField.id,
      });
    },
  });

  const [customFieldValueToDelete, setCustomFieldValueToDelete] = useState<{
    id: number;
    value: string;
  }>();

  const customFieldValueFieldName =
    `collectionItems[${rowIndex}].customFieldValues.${customField.id}` as const;

  const [showDeleteCustomFieldValueDialog, hideCustomFieldValueDialog] =
    useDialog(() => {
      return (
        <form.Field key={key} name={customFieldValueFieldName}>
          {(field) => {
            return (
              customFieldValueToDelete && (
                <DeleteCustomFieldValueDialog
                  collectionItemId={collectionItemId}
                  customFieldValueToDelete={customFieldValueToDelete}
                  handleFieldChange={field.handleChange}
                  onClose={hideCustomFieldValueDialog}
                  selectedCustomFieldValueId={customFieldValueForIndex?.id}
                />
              )
            );
          }}
        </form.Field>
      );
    }, [customFieldValueToDelete, customFieldValueForIndex?.id]);

  return isEditingRow ? (
    <form.Field key={key} name={customFieldValueFieldName}>
      {(field) => {
        const getValueForCustomField = <TValue extends CustomFieldValueDef>({
          values,
        }: {
          values: CreateOrUpdateCollectionItemFormDataDef;
        }) => {
          const valueForCustomField =
            values.collectionItems[rowIndex].customFieldValues?.[
              customField.id
            ];

          if (valueForCustomField) {
            const { data, ...rest } = valueForCustomField;

            return {
              valueForCustomField: {
                ...rest,
                data: { value: data.value as TValue },
              },
            };
          } else {
            return { valueForCustomField: undefined };
          }
        };

        return (
          <>
            {customField.type === 'boolean' && (
              <form.Subscribe
                selector={({ values }) => {
                  return getValueForCustomField<boolean>({ values });
                }}
              >
                {({ valueForCustomField }) => {
                  return (
                    <CheckboxField
                      checked={valueForCustomField?.data?.value}
                      disabled={processing}
                      onCheckedChange={async (value) => {
                        const [newCustomFieldValue] =
                          await onCreateCustomFieldValues({
                            records: [{ customFieldId: customField.id, value }],
                          });

                        field.handleChange(newCustomFieldValue);
                      }}
                    />
                  );
                }}
              </form.Subscribe>
            )}

            {customField.type === 'number' && (
              <form.Subscribe
                selector={({ values }) => {
                  return getValueForCustomField<number>({ values });
                }}
              >
                {({ valueForCustomField }) => {
                  return (
                    <InputField
                      onValueChange={async (value) => {
                        const formattedValue = Number(value);

                        const [newCustomFieldValue] =
                          await onCreateCustomFieldValues({
                            records: [
                              {
                                customFieldId: customField.id,
                                value: formattedValue,
                              },
                            ],
                          });

                        field.handleChange(newCustomFieldValue);
                      }}
                      placeholder={`Input ${customField.name}...`}
                      triggerOnBlur
                      type="number"
                      value={valueForCustomField?.data?.value}
                    />
                  );
                }}
              </form.Subscribe>
            )}

            {customField.type === 'string' && (
              <form.Subscribe
                selector={({ values }) => {
                  return getValueForCustomField<string>({ values });
                }}
              >
                {({ valueForCustomField }) => {
                  const items = customFieldValuesForColumn.map(
                    ({ data, id }) => {
                      return { id, value: data.value };
                    },
                  );

                  return (
                    <ComboboxField
                      allowCreatable
                      ariaLabel={customField.name}
                      caseSensitiveCreation
                      createNewItem={(label) => {
                        return {
                          id: uuidv4() as unknown as number,
                          value: label,
                        };
                      }}
                      idProperty="id"
                      inputValue={valueForCustomField?.data?.value}
                      items={items}
                      labelProperty="value"
                      name={field.name}
                      onValueChange={async (selectedItem) => {
                        if (selectedItem) {
                          const customFieldValueExistsInDB =
                            typeof selectedItem.id === 'number';

                          const matchesCurrentSelection =
                            valueForCustomField?.id === selectedItem.id;
                          if (matchesCurrentSelection) {
                            // ? deselect item
                            field.handleChange(undefined);
                          } else if (customFieldValueExistsInDB) {
                            // ? use selected item
                            field.handleChange({
                              data: {
                                value: selectedItem.value,
                              },
                              id: selectedItem.id,
                            });
                          } else {
                            // ? create selected item in DB
                            const [newCustomFieldValue] =
                              await onCreateCustomFieldValues({
                                records: [
                                  {
                                    customFieldId: customField.id,
                                    value: selectedItem.value,
                                  },
                                ],
                              });

                            field.handleChange(newCustomFieldValue);
                          }
                        }
                      }}
                      placeholder={`Input ${customField.name}...`}
                      RenderItem={({ item, SelectedIndicator }) => {
                        return (
                          <div className="flex gap-2 items-center w-full">
                            <span>{item.value}</span>
                            <SelectedIndicator>
                              <CheckIcon fontSize="inherit" />
                            </SelectedIndicator>

                            <Button
                              className="text-gray-600 hover:text-red-700 cursor-pointer ml-auto px-2 py-1"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();

                                setCustomFieldValueToDelete(item);
                                showDeleteCustomFieldValueDialog();

                                // TODO - ADD LOGIC TO CHECK IF MORE THAN ONE LINK EXISTS IN DB. IF SO, JUST RETURN AND UPDATE FIELD. OTHERWISE OPEN MODAL TO CONFIRM DELETE CUSTOM FIELD VALUE. ON CONFIRM, UPDATE FIELD
                                // editCustomFieldAtom.data.setValue(item);
                              }}
                              size="custom"
                              variant="ghost"
                            >
                              <DeleteIcon fontSize="inherit" />
                            </Button>
                          </div>
                        );
                      }}
                      value={
                        valueForCustomField
                          ? {
                              id: valueForCustomField.id,
                              value: valueForCustomField.data.value,
                            }
                          : undefined
                      }
                    />
                  );
                }}
              </form.Subscribe>
            )}
          </>
        );
      }}
    </form.Field>
  ) : (
    <Fragment key={key}>
      {customField.type === 'boolean' ? (
        <CheckboxField
          checked={!!customFieldValueForIndex?.data?.value}
          disabled
        />
      ) : (
        <p>{customFieldValueForIndex?.data?.value || '-'}</p>
      )}
    </Fragment>
  );
};
