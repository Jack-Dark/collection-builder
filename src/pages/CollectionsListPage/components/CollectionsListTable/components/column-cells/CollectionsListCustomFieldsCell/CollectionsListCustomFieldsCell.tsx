import type { PropsWithChildren } from 'react';

import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useSelector } from '@tanstack/react-form';
import { useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import type { CustomFieldTypeDef } from '#/api/db-tables-schema.types';
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
import { getCreateDefaultZustandStore } from '#/helpers/get-create-default-zustand-state';
import { pluralize } from '#/helpers/pluralize';
import { replaceValueInArrayField } from '#/helpers/replace-value-in-array-field';
import { useEditingCollectionsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

type CustomFieldFormItemDef =
  | {
      id: number;
      name: string;
      type: CustomFieldTypeDef;
    }
  | {
      id: string;
      name: string;
      type: CustomFieldTypeDef;
    };

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
  value: CustomFieldFormItemDef[];
}) => {
  const { form, index: rowIndex, rowId, value: customFields } = props;

  const { getIsEditingRowId } = useEditingCollectionsRowIds();

  const isEditingRow = getIsEditingRowId(rowId);

  const editCustomFieldAtom = useEditCustomFieldAtom();

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
              value: CustomFieldFormItemDef,
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
      <DeleteCustomFieldDialog
        customField={editCustomFieldAtom.data.value}
        form={form}
        onClose={hideConfirmDeleteCustomFieldDialog}
      />
    );
  }, [editCustomFieldAtom.data.value]);

  return (
    <div>
      {isEditingRow ? (
        <form.ArrayField name="records">
          {() => {
            return (
              <form.ArrayField name={`records[${rowIndex}].customFields`}>
                {({ name, removeValue }) => {
                  return (
                    <div className="w-full max-w-80">
                      <ComboboxField
                        allowCreatable
                        ariaLabel="Custom Field"
                        caseSensitiveCreation
                        createNewItem={(trimmedQuery) => {
                          const newRecord: CustomFieldFormItemDef = {
                            id: uuidv4(),
                            name: trimmedQuery,
                            type: null as unknown as CustomFieldTypeDef,
                          };

                          editCustomFieldAtom.data.setValue(newRecord);

                          return newRecord;
                        }}
                        idProperty="id"
                        isItemEqualToValue={(item, value) => {
                          return item?.id === value?.id;
                        }}
                        items={customFieldsInDb}
                        labelProperty="name"
                        multiple
                        name={name}
                        onRemoveChip={(chip) => {
                          const matchingIndex = customFieldsForRow.findIndex(
                            (field) => {
                              return field.id === chip.id;
                            },
                          );
                          removeValue(matchingIndex);
                        }}
                        onValueChange={(customFields) => {
                          const lastAddedIndex = customFields.findIndex(
                            ({ id }) => {
                              return id === editCustomFieldAtom.data.value.id;
                            },
                          );

                          if (lastAddedIndex >= 0) {
                            editCustomFieldAtom.index.setValue(lastAddedIndex);
                            showAddOrEditCustomFieldsDialog();
                          } else {
                            editCustomFieldAtom.index.resetValue();
                          }

                          form.setFieldValue(name, customFields);
                        }}
                        placeholder="Input custom fields..."
                        RenderChip={({ item }) => {
                          return (
                            <RenderItem item={item}>
                              <span className="text-gray-600 hover:text-primary-700 cursor-pointer leading-0">
                                <EditIcon
                                  fontSize="inherit"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    const indexToEdit =
                                      customFieldsForRow.findIndex(({ id }) => {
                                        return id === item.id;
                                      });
                                    if (indexToEdit >= 0) {
                                      editCustomFieldAtom.index.setValue(
                                        indexToEdit,
                                      );
                                      editCustomFieldAtom.data.setValue(item);

                                      showAddOrEditCustomFieldsDialog();
                                    }
                                  }}
                                />
                              </span>
                            </RenderItem>
                          );
                        }}
                        RenderItem={({ item, multiple, SelectedIndicator }) => {
                          return (
                            <div className="flex gap-2 items-center w-full">
                              <RenderItem item={item} />
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

                                  editCustomFieldAtom.data.setValue(item);

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
                        value={customFieldsForRow}
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
      ) : customFields.length ? (
        customFields.map((item) => {
          const { id } = item;

          return (
            <span
              className="group/controls flex items-center gap-2 flex-wrap"
              key={id}
            >
              <RenderItem item={item} />
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
  customField: CustomFieldFormItemDef;
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
          (customField) => {
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
      </div>
    </Dialog>
  );
};

export const AddOrEditCustomFieldDialog = (props: {
  form: CreateOrUpdateCollectionFormTypeDef;
  onClose: () => void;
  removeValue: (index: number) => void;
  replaceValue: (index: number, customField: CustomFieldFormItemDef) => void;
  rowIndex: number;
}) => {
  const { form, onClose, removeValue, replaceValue, rowIndex } = props;

  const [fieldTypeError, setFieldTypeError] = useState<string | undefined>();

  const editCustomFieldAtom = useEditCustomFieldAtom();

  const customFieldSnapshot = editCustomFieldAtom.data.value;
  const customFieldIndex = editCustomFieldAtom.index.value;

  const customFieldAtIndex = useSelector(form.atom, ({ values }) => {
    return values.records[rowIndex]?.customFields?.[customFieldIndex];
  });

  const isValid = useMemo(() => {
    return (
      !fieldTypeError && customFieldFormSchema.validate(customFieldAtIndex)
    );
  }, [customFieldAtIndex?.name, customFieldAtIndex?.type, fieldTypeError]);

  const { onInterceptProcessingRequest, processing } = useSpinner();
  const { onCreateCustomFields } = useCreateCustomFields();
  const { onUpdateCustomFields } = useUpdateCustomFields();

  const invalidateGetCustomFields = useInvalidateGetCustomFields();

  const isNewRecord = useMemo(() => {
    return typeof customFieldAtIndex?.id === 'string';
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
      const { id, name, type } = customFieldAtIndex;

      if (typeof id === 'string') {
        const [newRecord] = await onCreateCustomFields({
          records: [{ name, type }],
        });

        replaceValue(customFieldIndex, {
          id: newRecord.id,
          name: newRecord.name,
          type: newRecord.type,
        });
      } else {
        const [updatedRecord] = await onUpdateCustomFields({
          records: [{ id, name, type }],
        });

        replaceValue(customFieldIndex, {
          id: updatedRecord.id,
          name: updatedRecord.name,
          type: updatedRecord.type,
        });
      }

      invalidateGetCustomFields();
      onClose();
    });
  };

  // TODO - wrap inside conditional with Suspense so data is only fetched when editing a row
  const { data: customFieldsInDb = [] } = useGetCustomFields({
    placeholderData: [],
    requestArgs: {
      params: {
        limit: 1000,
        page: 1,
        search: '',
        sort: {
          direction: 'asc',
          field: 'name',
        },
      },
    },
  });

  const customFieldDataTypeItems = useMemo(() => {
    const customFieldsInDbWithSameName = customFieldsInDb.filter(
      ({ id, name }) => {
        return (
          name === customFieldAtIndex?.name && id !== customFieldAtIndex?.id
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
  }, [customFieldAtIndex?.name, customFieldAtIndex?.type]);

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
          name={`records[${rowIndex}].customFields[${customFieldIndex}].name`}
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
                value={customFieldAtIndex?.name}
              />
            );
          }}
        </form.Field>

        <form.Field
          name={`records[${rowIndex}].customFields[${customFieldIndex}].type`}
        >
          {(typeField) => {
            const value = fieldDataTypeItems.find(({ id }) => {
              return id === customFieldAtIndex?.type;
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

        <p className="max-w-100 text-gray-500 text-sm">
          Note: Saving will {isNewRecord ? 'create the' : 'update your'} custom
          field, even if changes to your collection are dismissed.
        </p>
      </div>
    </Dialog>
  );
};

const RenderItem = (
  props: PropsWithChildren<{ item: CustomFieldFormItemDef }>,
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

const createEditCustomFieldAtom = () => {
  const createLastEditedAtom =
    getCreateDefaultZustandStore<CustomFieldFormItemDef>({
      id: -1,
      name: '',
      type: 'string',
    });

  const createLastIndexAtom = getCreateDefaultZustandStore<number>(-1);

  return () => {
    return {
      data: createLastEditedAtom(),
      index: createLastIndexAtom(),
    };
  };
};

export const useEditCustomFieldAtom = createEditCustomFieldAtom();
