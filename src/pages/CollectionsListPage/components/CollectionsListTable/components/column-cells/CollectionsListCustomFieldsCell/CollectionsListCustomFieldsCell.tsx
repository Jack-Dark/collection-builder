import type { PropsWithChildren } from 'react';

import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useSelector } from '@tanstack/react-form';
import { createStore } from '@tanstack/react-store';
import { useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import type { CustomFieldTypeDef } from '#/api/db-tables-schema.types';
import type {
  CustomFieldDataForCollectionDef,
  OrderedCustomFieldForCollectionDef,
} from '#/api/routes/collections/get-paginated-collections/get-paginated-collections.types';
import type { CustomFieldFormSchemaDef } from '#/api/routes/custom-fields/custom-fields.types';
import type { HideDialog } from '#/components/Dialog/hooks/useDialog';
import type { CreateOrUpdateCollectionFormTypeDef } from '#/pages/CollectionsListPage/CollectionsListPage.types';

import { useGetCollectionsWithCustomFields } from '#/api/routes/collections/get-collections-with-custom-field/get-collections-with-custom-field.react-query';
import { useCreateCustomFields } from '#/api/routes/custom-fields/create-custom-fields/create-custom-fields.react-query';
import { customFieldFormSchema } from '#/api/routes/custom-fields/custom-fields.schema';
import { useDeleteCustomFields } from '#/api/routes/custom-fields/delete-custom-fields/delete-custom-fields.react-query';
import {
  useGetCustomFields,
  useInvalidateGetCustomFields,
} from '#/api/routes/custom-fields/get-custom-fields/get-custom-fields.react-query';
import { useUpdateCustomFields } from '#/api/routes/custom-fields/update-custom-fields/update-custom-fields.react-query';
import { Button } from '#/components/Button';
import { Dialog } from '#/components/Dialog';
import { useDialog } from '#/components/Dialog/hooks/useDialog';
import { ComboboxField } from '#/components/Fields/ComboboxField';
import { InputField } from '#/components/Fields/InputField';
import { SelectField } from '#/components/Fields/SelectField';
import { useSpinner } from '#/components/FullPageLoadingSpinner/useSpinner';
import { pluralize } from '#/helpers/pluralize';
import { replaceValueInArrayField } from '#/helpers/replace-value-in-array-field';
import { useEditingCollectionsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

export const customFieldTypeLabelsMap = {
  boolean: 'True/False',
  number: 'Number',
  string: 'Text',
} as const;

const fieldDataTypeItems = [
  {
    id: null as unknown as CustomFieldTypeDef,
    label: 'Select data type...',
  },
  ...(['number', 'string', 'boolean'] as const).map((type) => {
    return {
      id: type,
      label: customFieldTypeLabelsMap[type],
    };
  }),
] satisfies {
  id: CustomFieldTypeDef;
  label: string;
}[];

const getFieldItemLabel = (type: CustomFieldTypeDef) => {
  return (
    fieldDataTypeItems.find((fieldItem) => {
      return fieldItem.id === type;
    })?.label || '-'
  );
};

export const CollectionsListCustomFieldsCell = (props: {
  form: CreateOrUpdateCollectionFormTypeDef;
  index: number;
  rowId: string;
}) => {
  const { form, index: rowIndex, rowId } = props;

  const { getIsEditingRowId } = useEditingCollectionsRowIds();

  const isEditingRow = getIsEditingRowId(rowId);

  // const editCustomFieldAtom = useEditCustomFieldAtom();

  // TODO - wrap inside conditional with Suspense so data is only fetched when editing a row
  const { data: customFieldsInDb = [] } = useGetCustomFields({
    placeholderData: [],
    requestArgs: {},
  });

  const customFieldsForRow = useSelector(form.atom, ({ values }) => {
    return values.records[rowIndex].customFields;
  });

  const [showAddOrEditCustomFieldsDialog, hideAddOrEditCustomFieldsDialog] =
    useDialog(() => {
      return (
        <form.ArrayField name={`records[${rowIndex}].customFields`}>
          {(customFieldFormField) => {
            const { removeValue } = customFieldFormField;

            const replaceValue = (
              index: number,
              value: CustomFieldFormSchemaDef,
            ) => {
              replaceValueInArrayField(customFieldFormField, index, value);
            };

            return (
              <AddOrEditCustomFieldDialog
                form={form}
                onClose={hideAddOrEditCustomFieldsDialog}
                removeValue={removeValue}
                replaceValue={replaceValue}
                rowIndex={rowIndex}
              />
            );
          }}
        </form.ArrayField>
      );
    }, [customFieldsForRow]);

  const [
    showConfirmDeleteCustomFieldDialog,
    hideConfirmDeleteCustomFieldDialog,
  ] = useDialog(() => {
    return (
      lastEditedCustomFieldStore.state.data && (
        <DeleteCustomFieldDialog
          customField={lastEditedCustomFieldStore.state.data?.customField}
          form={form}
          onClose={hideConfirmDeleteCustomFieldDialog}
        />
      )
    );
  }, [lastEditedCustomFieldStore.state.data?.customField?.id]);

  return (
    <div>
      {isEditingRow ? (
        <form.ArrayField name="records">
          {() => {
            return (
              <form.ArrayField name={`records[${rowIndex}].customFields`}>
                {({ handleChange, name, removeValue, value }) => {
                  const comboboxValue = value.map(({ customField }) => {
                    return {
                      ...customField,
                      id: customField.id,
                    };
                  });

                  return (
                    <div className="w-full max-w-80">
                      <ComboboxField
                        allowCreatable
                        ariaLabel="Custom Field"
                        caseSensitiveCreation
                        createNewItem={(trimmedQuery) => {
                          const newRecord: CustomFieldDataForCollectionDef = {
                            id: uuidv4() as unknown as number,
                            name: trimmedQuery,
                            type: null as unknown as CustomFieldTypeDef,
                          };

                          const index = customFieldsForRow.length;
                          lastEditedCustomFieldStore.setState((prev) => {
                            return {
                              ...prev,
                              data: {
                                customField: newRecord,
                                order: index,
                              },
                              index,
                            };
                          });

                          return newRecord;
                        }}
                        enableChipSort
                        idProperty="name"
                        isItemEqualToValue={(item, value) => {
                          return item?.id === value?.id;
                        }}
                        items={customFieldsInDb}
                        labelProperty="name"
                        multiple
                        name={name}
                        onChipSort={(items) => {
                          const itemsWithOrder = items.map((item, index) => {
                            return { customField: item, order: index };
                          });
                          handleChange(itemsWithOrder);
                        }}
                        onRemoveChip={(chip) => {
                          const matchingIndex = customFieldsForRow.findIndex(
                            (data) => {
                              return data.customField.id === chip.id;
                            },
                          );
                          removeValue(matchingIndex);
                        }}
                        onValueChange={(customFields) => {
                          const lastAddedIndex = customFields.findIndex(
                            (customField) => {
                              return (
                                customField.id ===
                                lastEditedCustomFieldStore.state.data
                                  ?.customField.id
                              );
                            },
                          );

                          if (lastAddedIndex >= 0) {
                            lastEditedCustomFieldStore.setState((prev) => {
                              return { ...prev, index: lastAddedIndex };
                            });
                            showAddOrEditCustomFieldsDialog();
                          } else {
                            lastEditedCustomFieldStore.setState((prev) => {
                              return {
                                ...prev,
                                index: undefined as unknown as number,
                              };
                            });
                          }

                          form.setFieldValue(
                            name,
                            customFields.map((customField, index) => {
                              return {
                                customField,
                                order: index,
                              };
                            }),
                          );
                        }}
                        placeholder="Input custom fields..."
                        RenderChip={({ item }) => {
                          return (
                            <RenderCustomField item={item}>
                              <span className="text-gray-600 hover:text-primary-700 cursor-pointer leading-0">
                                <EditIcon
                                  fontSize="inherit"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    const indexToEdit =
                                      customFieldsForRow.findIndex(
                                        ({ customField }) => {
                                          return customField.id === item.id;
                                        },
                                      );
                                    if (indexToEdit >= 0) {
                                      lastEditedCustomFieldStore.setState(
                                        (prev) => {
                                          return {
                                            ...prev,
                                            index: indexToEdit,
                                          };
                                        },
                                      );
                                      lastEditedCustomFieldStore.setState(
                                        (prev) => {
                                          return {
                                            ...prev,
                                            data: {
                                              customField: item,
                                              order: indexToEdit,
                                            },
                                          };
                                        },
                                      );

                                      showAddOrEditCustomFieldsDialog();
                                    }
                                  }}
                                />
                              </span>
                            </RenderCustomField>
                          );
                        }}
                        RenderItem={({ item, multiple, SelectedIndicator }) => {
                          return (
                            <div className="flex gap-2 items-center w-full">
                              <RenderCustomField item={item} />
                              {multiple && (
                                <SelectedIndicator>
                                  <CheckIcon fontSize="inherit" />
                                </SelectedIndicator>
                              )}

                              <Button
                                className="text-gray-600 hover:text-red-700 cursor-pointer ml-auto px-2 py-1"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();

                                  const itemIndex =
                                    customFieldsForRow.findIndex(
                                      ({ customField }) => {
                                        return customField.id === item.id;
                                      },
                                    );

                                  lastEditedCustomFieldStore.setState(
                                    (prev) => {
                                      return {
                                        ...prev,
                                        data: {
                                          customField: item,
                                          order: itemIndex,
                                        },
                                        index: itemIndex,
                                      };
                                    },
                                  );

                                  showConfirmDeleteCustomFieldDialog();
                                }}
                                size="custom"
                                variant="ghost"
                              >
                                <DeleteIcon fontSize="inherit" />
                              </Button>
                            </div>
                          );
                        }}
                        value={comboboxValue}
                        verifyShowNewItem={({ itemMatchingQuery, newItem }) => {
                          return newItem.type !== itemMatchingQuery?.type;
                        }}
                      />
                    </div>
                  );
                }}
              </form.ArrayField>
            );
          }}
        </form.ArrayField>
      ) : customFieldsForRow.length ? (
        customFieldsForRow.map(({ customField }) => {
          return (
            <span
              className="group/controls flex items-center gap-2 flex-wrap"
              key={customField.id}
            >
              <RenderCustomField item={customField} />
            </span>
          );
        })
      ) : (
        '-'
      )}
    </div>
  );
};

export const DeleteCustomFieldDialog = (props: {
  customField: OrderedCustomFieldForCollectionDef<
    number | string
  >['customField'];
  form: CreateOrUpdateCollectionFormTypeDef;
  onClose: HideDialog;
}) => {
  const { customField, form, onClose } = props;

  const id = Number(customField.id);

  const { data: collectionsWithCustomField } =
    useGetCollectionsWithCustomFields({
      placeholderData: [],
      requestArgs: {
        customFieldIds: [id],
      },
    });

  const invalidateGetCustomFields = useInvalidateGetCustomFields();

  const { onDeleteCustomFields, processing } = useDeleteCustomFields({
    onSuccess: async () => {
      await invalidateGetCustomFields();

      // TODO - PASS FIELD ONCHANGE FUNCTION TO MODAL TO UPDATE ONLY THAT FIELD
      const cleanedRecords = form.state.values.records.map((record) => {
        const filteredCustomFields = record.customFields.filter(
          ({ customField }) => {
            return customField.id !== id;
          },
        );

        return { ...record, customFields: filteredCustomFields };
      });
      form.setFieldValue('records', cleanedRecords);

      onClose();
    },
  });

  const numAffectedCollections = collectionsWithCustomField.length;

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
                await onDeleteCustomFields({ ids: [id] });
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
      onClose={onClose}
    >
      <div className="grid gap-4">
        <p className="text-center">
          Are you sure you want to delete this field?
        </p>

        <h4 className="text-center">
          {customField.name}{' '}
          <span className="text-gray-500 text-[.7em]">
            ({customFieldTypeLabelsMap[customField.type]})
          </span>
        </h4>

        {!!numAffectedCollections && (
          <div className="grid gap-1">
            <p className="text-center text-sm text-gray-600">
              This will remove the field from {numAffectedCollections}{' '}
              {pluralize('collection', numAffectedCollections)} and{' '}
              {customField.name} details from all items within.
            </p>
            <p className="text-center text-sm text-gray-600">
              <em>This cannot be undone.</em>
            </p>
          </div>
        )}

        <p className="max-w-100 text-gray-600 text-sm text-center">
          Note: This will delete the custom field, even if changes to your
          collection are dismissed.
        </p>
      </div>
    </Dialog>
  );
};

export const AddOrEditCustomFieldDialog = (props: {
  form: CreateOrUpdateCollectionFormTypeDef;
  onClose: () => void;
  removeValue: (index: number) => void;
  replaceValue: (index: number, customField: CustomFieldFormSchemaDef) => void;
  rowIndex: number;
}) => {
  const { form, onClose, removeValue, replaceValue, rowIndex } = props;

  const [fieldTypeError, setFieldTypeError] = useState<string | undefined>();

  // const editCustomFieldAtom = useEditCustomFieldAtom();

  const customFieldSnapshot = lastEditedCustomFieldStore.state.data;
  const customFieldIndex = lastEditedCustomFieldStore.state.index;

  const customFieldAtIndex = useSelector(form.atom, ({ values }) => {
    return values.records[rowIndex]?.customFields?.[customFieldIndex];
  });

  const isValid = useMemo(() => {
    return (
      !fieldTypeError && customFieldFormSchema.validate(customFieldAtIndex)
    );
  }, [
    customFieldAtIndex?.customField?.name,
    customFieldAtIndex?.customField?.type,
    fieldTypeError,
  ]);

  const { onInterceptProcessingRequest, processing } = useSpinner();
  const { onCreateCustomFields } = useCreateCustomFields();
  const { onUpdateCustomFields } = useUpdateCustomFields();

  const invalidateGetCustomFields = useInvalidateGetCustomFields();

  const isNewRecord = useMemo(() => {
    return typeof customFieldAtIndex.customField?.id === 'string';
  }, []);

  const onCancel = () => {
    onClose();

    if (isNewRecord) {
      removeValue(customFieldIndex);
    } else {
      replaceValue(customFieldIndex, customFieldSnapshot);
    }
  };

  const onSave = async () => {
    await onInterceptProcessingRequest(async () => {
      const { customField, order } = customFieldAtIndex;
      const { id, name, type } = customField;

      if (typeof id === 'string') {
        const [newRecord] = await onCreateCustomFields({
          records: [{ name, type }],
        });

        replaceValue(customFieldIndex, {
          customField: {
            id: newRecord.id,
            name: newRecord.name,
            type: newRecord.type,
          },
          order,
        });
      } else {
        await onUpdateCustomFields({
          records: [{ id, name, type }],
        });
      }

      invalidateGetCustomFields();
      onClose();
    });
  };

  // TODO - wrap inside conditional with Suspense so data is only fetched when editing a row
  const { data: customFieldsInDb = [] } = useGetCustomFields({
    placeholderData: [],
    requestArgs: {},
  });

  const customFieldDataTypeItems = useMemo(() => {
    const customFieldsInDbWithSameName = customFieldsInDb.filter(
      ({ id, name }) => {
        return (
          name === customFieldAtIndex.customField?.name &&
          id !== customFieldAtIndex.customField?.id
        );
      },
    );

    let fieldTypeError: string | undefined;

    const typeItemsWithDisabledStates = fieldDataTypeItems.map(
      (fieldDataTypeItem) => {
        const isPlaceholderItem = !fieldDataTypeItem.id;

        if (isPlaceholderItem) {
          return { ...fieldDataTypeItem, disabled: true };
        }

        // TODO - CONSIDER ADDING VALIDATION TO DATA TYPE FIELD
        const disabled = customFieldsInDbWithSameName.some(({ type }) => {
          return type === fieldDataTypeItem.id;
        });

        if (disabled) {
          fieldTypeError = 'Matches existing custom field';
        }

        return { ...fieldDataTypeItem, disabled };
      },
    );

    setFieldTypeError(fieldTypeError);

    return typeItemsWithDisabledStates;
  }, [
    customFieldAtIndex.customField?.name,
    customFieldAtIndex.customField?.type,
  ]);

  return (
    <Dialog
      disableOnClose={processing}
      Footer={() => {
        return (
          <>
            <Button
              disabled={processing}
              onClick={onCancel}
              text="Cancel"
              variant="mono"
            />
            <Button
              disabled={!isValid}
              onClick={onSave}
              processing={processing}
              text="Save"
            />
          </>
        );
      }}
      Header={`${isNewRecord ? 'Create' : 'Edit'} Custom Field`}
      onClose={onCancel}
    >
      <div className="grid gap-4">
        <form.Field
          name={`records[${rowIndex}].customFields[${customFieldIndex}].customField.name`}
        >
          {(nameField) => {
            return (
              <InputField
                autoFocus
                error={nameField.errors}
                label="Field Name"
                name={nameField.name}
                onValueChange={(value) => {
                  nameField.handleChange(value);
                }}
                placeholder="Input column name..."
                value={customFieldAtIndex.customField?.name}
              />
            );
          }}
        </form.Field>

        <form.Field
          name={`records[${rowIndex}].customFields[${customFieldIndex}].customField.type`}
        >
          {(typeField) => {
            const value = fieldDataTypeItems.find(({ id }) => {
              return id === customFieldAtIndex.customField?.type;
            });

            return (
              <SelectField
                error={fieldTypeError || typeField.errors}
                items={customFieldDataTypeItems}
                label="Data Type"
                name={typeField.name}
                onValueChange={(value) => {
                  const type = value?.id;
                  if (type) {
                    typeField.handleChange(type);
                  }
                }}
                value={value}
              />
            );
          }}
        </form.Field>

        <p className="max-w-100 text-gray-500 text-sm text-center">
          Note: This will {isNewRecord ? 'create the' : 'update your'} custom
          field, even if changes to your collection are dismissed.
        </p>
      </div>
    </Dialog>
  );
};

const RenderCustomField = (
  props: PropsWithChildren<{
    item: CustomFieldDataForCollectionDef<string | number>;
  }>,
) => {
  const { children, item } = props;

  const { id, name, type } = item;

  return (
    <>
      <span className="whitespace-nowrap" key={id}>
        <span>{name}</span>{' '}
        <span className="text-gray-500 text-xs leading-none">
          ({getFieldItemLabel(type)})
        </span>
      </span>
      {children}
    </>
  );
};

const lastEditedCustomFieldStore = createStore<{
  data: CustomFieldFormSchemaDef;
  index: number;
}>({
  data: undefined as unknown as CustomFieldFormSchemaDef,
  index: undefined as unknown as number,
});
