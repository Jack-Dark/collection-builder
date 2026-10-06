import type { AnyFieldApi } from '@tanstack/react-form';
import type { AccessorKeyColumnDefBase } from '@tanstack/react-table';

import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import { createColumnHelper } from '@tanstack/react-table';
import { Fragment } from 'react/jsx-runtime';
import { v4 as uuidv4 } from 'uuid';

import type { CollectionItemRecordDef } from '#/api/routes/collection-items/collection-item.types';
import type { CustomFieldValueDef } from '#/api/routes/custom-field-values/custom-field-values.types';
import type { HideDialog } from '#/components/Dialog/hooks/useDialog';

import { useGetCollectionItemsWithCustomFieldValue } from '#/api/routes/collection-items/get-collection-items-with-custom-field-value/get-collection-items-with-custom-field-value.react-query';
import { useCreateCustomFieldValues } from '#/api/routes/custom-field-values/create-custom-field-value/create-custom-field-value.react-query';
import { useDeleteCustomFieldValues } from '#/api/routes/custom-field-values/delete-custom-field-values/delete-custom-field-values.react-query';
import {
  useGetCustomFieldValuesByCustomFieldId,
  useInvalidateGetCustomFieldValuesByCustomFieldId,
} from '#/api/routes/custom-field-values/get-custom-field-values-by-collection-id/get-custom-field-values-by-collection-id.react-query';
import { Button } from '#/components/Button';
import { Dialog } from '#/components/Dialog';
import { useDialog } from '#/components/Dialog/hooks/useDialog';
import { ComboboxField } from '#/components/Fields/ComboboxField';
import { InputField } from '#/components/Fields/InputField';
import { SwitchField } from '#/components/Fields/SwitchField';
import { pluralize } from '#/helpers/pluralize';
import { useEditingCollectionItemsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';
import { Route } from '#/routes/_protected/collections/$id';

import type {
  CreateOrUpdateCollectionItemFormDataDef,
  CreateOrUpdateCollectionItemFormRowDataDef,
} from '../../CollectionDetailsPage.types';
import type { GetCollectionItemsTableColumnsPropsDef } from './CollectionDetailsTable.types';

import { CollectionDetailsActionsCell } from './components/column-cells/CollectionDetailsActionsCell';
import { CollectionDetailsCreatedAtCell } from './components/column-cells/CollectionDetailsCreatedAtCell';
import { CollectionDetailsCustomFieldCell } from './components/column-cells/CollectionDetailsCustomFieldCell';
import { CollectionDetailsEditionCell } from './components/column-cells/CollectionDetailsEditionCell';
import { CollectionDetailsImagesCell } from './components/column-cells/CollectionDetailsImagesCell';
import { CollectionDetailsImagesField } from './components/column-cells/CollectionDetailsImagesCell/components/CollectionDetailsImagesField';
import { CollectionDetailsNameCell } from './components/column-cells/CollectionDetailsNameCell';
import { CollectionDetailsNotesCell } from './components/column-cells/CollectionDetailsNotesCell';
import { useCollectionDetailsCustomFieldsStore } from './hooks/use-collection-details-custom-fields-store';

const columnHelper =
  createColumnHelper<CreateOrUpdateCollectionItemFormRowDataDef>();

export const useGetCollectionItemsTableColumns = (
  props: GetCollectionItemsTableColumnsPropsDef,
) => {
  const {
    customField1Enabled,
    customField1Label,
    customField2Enabled,
    customField2Label,
    customField3Enabled,
    customField3Label,
    customFields,
    form,
    onCancel,
    onEditClick,
  } = props;

  const { id } = Route.useParams();
  const collectionId = Number(id);

  return [
    columnHelper.accessor('name', {
      cell: (props) => {
        const { getValue, row } = props;

        return (
          <CollectionDetailsNameCell
            form={form}
            index={row.index}
            rowId={row.id}
            value={getValue()}
          />
        );
      },
      header: 'Name',
      size: 250,
    }),
    columnHelper.accessor('images', {
      cell: (props) => {
        const { row } = props;

        return (
          <CollectionDetailsImagesCell {...props}>
            <CollectionDetailsImagesField form={form} index={row.index} />
          </CollectionDetailsImagesCell>
        );
      },
      header: 'Images',
      minSize: 200,
    }),
    ...customFields.map((customField, index) => {
      return columnHelper.accessor('customFieldValues', {
        cell: ({ getValue, row }) => {
          const { data: customFieldValuesForColumn } =
            useGetCustomFieldValuesByCustomFieldId({
              placeholderData: [],
              requestArgs: {
                id: customField.id,
              },
            });

          const { getIsEditingRowId } = useEditingCollectionItemsRowIds();

          const isEditingRow = getIsEditingRowId(row.id);

          const customFieldId = customField.id;

          const customFieldValueForIndex = getValue()?.[customFieldId];

          const key = customFieldValueForIndex?.id || customFieldId;

          const { onCreateCustomFieldValues, processing } =
            useCreateCustomFieldValues();

          const [showDeleteCustomFieldValueDialog, hideCustomFieldValueDialog] =
            useDialog(() => {
              return (
                <form.Field
                  key={key}
                  name={`collectionItems[${row.index}].customFieldValues.${customField.id}`}
                >
                  {(field) => {
                    return (
                      <DeleteCustomFieldDialog
                        collectionItemId={row.original.id}
                        customFieldValue={customFieldValueForIndex}
                        handleFieldChange={field.handleChange}
                        onClose={hideCustomFieldValueDialog}
                      />
                    );
                  }}
                </form.Field>
              );
            }, []);

          // TODO - LOOK MORE INTO `Combobox.createItems` LATER WHEN THINGS ARE WORKING AS EXPECTED
          // const comboboxItems = useMemo(() => {
          //   return Combobox.createItems(customFieldValuesForColumn, {
          //     getLabel: (item) => {
          //       return item.value;
          //     },
          //     getValue: (item) => {
          //       return item.id;
          //     },
          //   });
          // }, [customFieldValuesForColumn]);

          return isEditingRow ? (
            <form.Field
              key={key}
              name={`collectionItems[${row.index}].customFieldValues.${customField.id}`}
            >
              {(field) => {
                const getValueForCustomField = <
                  TValue extends CustomFieldValueDef,
                >({
                  values,
                }: {
                  values: CreateOrUpdateCollectionItemFormDataDef;
                }) => {
                  const valueForCustomField =
                    values.collectionItems[row.index].customFieldValues?.[
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
                            <SwitchField
                              checked={valueForCustomField?.data?.value}
                              disabled={processing}
                              onCheckedChange={async (value) => {
                                const customFieldValueId = field.value?.id;

                                if (customFieldValueId) {
                                  field.handleChange({
                                    data: { value },
                                    id: customFieldValueId,
                                  });
                                } else {
                                  const [newCustomFieldValue] =
                                    await onCreateCustomFieldValues({
                                      records: [{ customFieldId, value }],
                                    });

                                  field.handleChange(newCustomFieldValue);
                                }
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
                                const customFieldValueId = field.value?.id;
                                const formattedValue = Number(value);

                                if (customFieldValueId) {
                                  field.handleChange({
                                    data: { value: formattedValue },
                                    id: customFieldValueId,
                                  });
                                } else {
                                  const [newCustomFieldValue] =
                                    await onCreateCustomFieldValues({
                                      records: [
                                        {
                                          customFieldId,
                                          value: formattedValue,
                                        },
                                      ],
                                    });

                                  field.handleChange(newCustomFieldValue);
                                }
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
                                            customFieldId,
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
              {typeof customFieldValueForIndex?.data?.value === 'boolean' &&
              customFieldValueForIndex?.data?.value === true ? (
                <CheckIcon fontSize="inherit" />
              ) : (
                // ) : customFieldValueForIndex?.data?.value === false ? (
                //   <CloseIcon fontSize="inherit" />
                <p>{customFieldValueForIndex?.data?.value || '-'}</p>
              )}
            </Fragment>
          );
        },
        header: customField.name,
        id: String(customField.id),
        minSize: 200,
      });
    }),
    customField1Enabled &&
      columnHelper.accessor('customField1Value', {
        cell: ({ getValue, row }) => {
          const { addToCustomField1Values, customFields } =
            useCollectionDetailsCustomFieldsStore();

          return (
            <CollectionDetailsCustomFieldCell
              addToCustomFieldValues={addToCustomField1Values}
              fieldName="customField1Value"
              fieldValues={customFields.customField1Values}
              form={form}
              index={row.index}
              label={customField1Label || ''}
              rowId={row.id}
              value={getValue()}
            />
          );
        },
        header: customField1Label || '',
        minSize: 200,
      }),
    customField2Enabled &&
      columnHelper.accessor('customField2Value', {
        cell: ({ getValue, row }) => {
          const { addToCustomField2Values, customFields } =
            useCollectionDetailsCustomFieldsStore();

          return (
            <CollectionDetailsCustomFieldCell
              addToCustomFieldValues={addToCustomField2Values}
              fieldName="customField2Value"
              fieldValues={customFields.customField2Values}
              form={form}
              index={row.index}
              label={customField2Label || ''}
              rowId={row.id}
              value={getValue()}
            />
          );
        },
        header: customField2Label || '',
        minSize: 200,
      }),
    customField3Enabled &&
      columnHelper.accessor('customField3Value', {
        cell: ({ getValue, row }) => {
          const { addToCustomField3Values, customFields } =
            useCollectionDetailsCustomFieldsStore();

          return (
            <CollectionDetailsCustomFieldCell
              addToCustomFieldValues={addToCustomField3Values}
              fieldName="customField3Value"
              fieldValues={customFields.customField3Values}
              form={form}
              index={row.index}
              label={customField3Label || ''}
              rowId={row.id}
              value={getValue()}
            />
          );
        },
        header: customField3Label || '',
        minSize: 200,
      }),
    columnHelper.accessor('editionDetails', {
      cell: ({ getValue, row }) => {
        return (
          <CollectionDetailsEditionCell
            form={form}
            index={row.index}
            rowId={row.id}
            value={getValue()}
          />
        );
      },
      header: 'Edition',
      minSize: 200,
    }),
    columnHelper.accessor('notes', {
      cell: ({ getValue, row }) => {
        return (
          <CollectionDetailsNotesCell
            form={form}
            index={row.index}
            rowId={row.id}
            value={getValue()}
          />
        );
      },
      header: 'Notes',
      minSize: 210,
    }),
    columnHelper.accessor('createdAt', {
      cell: ({ getValue, row }) => {
        return (
          <CollectionDetailsCreatedAtCell
            form={form}
            index={row.index}
            rowId={row.id}
            value={getValue()}
          />
        );
      },
      header: 'Added',
      size: 200,
    }),
    columnHelper.accessor('id', {
      cell: (context) => {
        return (
          <CollectionDetailsActionsCell
            onCancel={onCancel}
            onEditClick={onEditClick}
            {...context}
          />
        );
      },
      header: '',
      id: 'actions',
      size: 40,
    }),
  ].filter(Boolean) as AccessorKeyColumnDefBase<CollectionItemRecordDef>[];
};

export const DeleteCustomFieldDialog = <
  THandleFieldChange extends AnyFieldApi['handleChange'],
>(props: {
  collectionItemId: number;
  customFieldValue: {
    id: number;
    value: string;
  };
  handleFieldChange: THandleFieldChange;
  onClose: HideDialog;
}) => {
  const { collectionItemId, customFieldValue, handleFieldChange, onClose } =
    props;

  const id = Number(customFieldValue.id);

  const { data } = useGetCollectionItemsWithCustomFieldValue({
    onSuccess: (data) => {
      console.log('🚀 ~ DeleteCustomFieldDialog ~ data:', data);
    },
    placeholderData: (_data) => {
      return {
        affectedCollections: [],
        numAffectedCollectionItems: 0,
      } satisfies typeof _data;
    },
    requestArgs: {
      id: customFieldValue.id,
    },
  });

  const invalidateGetCustomFieldValuesByCustomFieldId =
    useInvalidateGetCustomFieldValuesByCustomFieldId();

  const { onDeleteCustomFieldValues, processing } = useDeleteCustomFieldValues({
    onSuccess: async () => {
      await invalidateGetCustomFieldValuesByCustomFieldId();

      handleFieldChange(undefined);

      onClose();
    },
  });

  const { affectedCollections, numAffectedCollectionItems } = data;

  return (
    <Dialog
      disableOnClose={processing}
      Footer={() => {
        return (
          <>
            <Button disabled={processing} onClick={onClose} variant="mono">
              Cancel
            </Button>
            <Button
              onClick={async () => {
                await onDeleteCustomFieldValues({
                  collectionItemId,
                  ids: [id],
                });
              }}
              processing={processing}
              variant="alert"
            >
              Delete
            </Button>
          </>
        );
      }}
      Header="Delete Custom Field"
      maxWidthClassName="md:max-w-100"
      onClose={onClose}
    >
      <div className="grid gap-4">
        <p className="text-center">
          Are you sure you want to delete this custom field value?
        </p>

        <h4 className="text-center">{customFieldValue.value}</h4>

        {numAffectedCollectionItems > 1 && (
          <div className="grid gap-1">
            <p className="text-center text-sm text-gray-600">
              This will remove the field from {numAffectedCollectionItems}{' '}
              collection {pluralize('item', numAffectedCollectionItems)} across
              the following collections:
            </p>

            <ul>
              {affectedCollections.map(({ id, name }) => {
                return (
                  <li key={id}>
                    <p>{name}</p>
                  </li>
                );
              })}
            </ul>

            <p className="text-center text-sm text-gray-600">
              <em>This cannot be undone.</em>
            </p>
          </div>
        )}
      </div>
    </Dialog>
  );
};
