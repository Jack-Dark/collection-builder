import type { PropsWithChildren } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import { useSelector } from '@tanstack/react-form';
import { useLayoutEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import type { CustomFieldTypeDef } from '#/api/db-tables-schema.types';
import type { CreateOrUpdateCollectionFormTypeDef } from '#/pages/CollectionsListPage/CollectionsListPage.types';

import { useCreateCustomFields } from '#/api/routes/custom-fields/create-custom-fields/create-custom-fields.react-query';
import { customFieldFormSchema } from '#/api/routes/custom-fields/custom-fields.schema';
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

  const customFieldsForRow = useSelector(form.atom, ({ values }) => {
    return values.records[rowIndex].customFields;
  });

  const uniqueDisplayItems = useSelector(form.atom, ({ values }) => {
    const unsavedCustomFields = values.records
      .map(({ customFields }) => {
        return customFields.filter(({ creatable, id }) => {
          return typeof id === 'string' && !creatable;
        });
      })
      .flat();

    const includedItemsById = new Map<string, true>();

    const uniqueDisplayItems: CustomFieldFormItemDef[] = [
      ...customFieldsInDb,
      ...unsavedCustomFields,
    ].filter((item) => {
      if (!item.id || includedItemsById.has(String(item.id))) {
        return false;
      } else {
        includedItemsById.set(String(item.id), true);

        return true;
      }
    });

    return uniqueDisplayItems;
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

  return (
    <div>
      {isEditingRow ? (
        <form.ArrayField name="records">
          {() => {
            return (
              <form.ArrayField name={`records[${rowIndex}].customFields`}>
                {({ name, removeValue }) => {
                  return (
                    <div>
                      <ComboboxField
                        allowCreatable
                        createItem={(trimmedQuery) => {
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
                        // items={uniqueDisplayItems}
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
                              <span className="hover:text-primary-700 cursor-pointer leading-0">
                                <EditIcon
                                  fontSize="inherit"
                                  onClick={() => {
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
                        RenderItem={({ item }) => {
                          return <RenderItem item={item} />;
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

export const AddOrEditCustomFieldDialog = ({
  form,
  onClose,
  removeValue,
  replaceValue,
  rowIndex,
}: {
  form: CreateOrUpdateCollectionFormTypeDef;
  onClose: () => void;
  removeValue: (index: number) => void;
  replaceValue: (index: number, customField: CustomFieldFormItemDef) => void;
  rowIndex: number;
}) => {
  const editCustomFieldAtom = useEditCustomFieldAtom();

  const customFieldSnapshot = editCustomFieldAtom.data.value;
  const customFieldIndex = editCustomFieldAtom.index.value;

  const [name, setName] = useState<string>(
    form.state.values.records[rowIndex].customFields[customFieldIndex]?.name,
  );
  const [type, setType] = useState<CustomFieldTypeDef>(
    form.state.values.records[rowIndex].customFields[customFieldIndex]?.type,
  );
  const [isValid, setIsValid] = useState<boolean>(false);

  const validateCustomField = () => {
    // TODO - ADD VALIDATION LOGIC FOR WHEN THE NAME IS UPDATED TO MATCH AN EXISTING NAME AND THE TYPE MATCHES AN EXISTING TYPE
    const isValid = customFieldFormSchema.validate(getValue());

    setIsValid(isValid);
  };

  const { onInterceptProcessingRequest, processing } = useSpinner();
  const { onCreateCustomFields } = useCreateCustomFields();
  const { onUpdateCustomFields } = useUpdateCustomFields();

  const invalidateGetCustomFields = useInvalidateGetCustomFields();

  const getValue = () => {
    return form.state.values.records[rowIndex].customFields[customFieldIndex];
  };

  const isNewRecord = useMemo(() => {
    return typeof getValue()?.id === 'string';
  }, []);

  const customFieldAtIndex = useSelector(form.atom, ({ values }) => {
    return values.records[rowIndex]?.customFields?.[customFieldIndex];
  });

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
      const { id, name, type } = getValue();

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
    return fieldDataTypeItems.map((fieldDataTypeItem) => {
      const isPlaceholderItem = !fieldDataTypeItem.id;
      const matchesCurrentType = type === fieldDataTypeItem.id;

      if (isPlaceholderItem || matchesCurrentType) {
        return { ...fieldDataTypeItem, disabled: true };
      }

      const disabled = customFieldsInDb.some((existingCustomField) => {
        const matchesCurrentName = existingCustomField.name === name;
        const matchesTypeInList =
          existingCustomField.type === fieldDataTypeItem.id;

        return matchesCurrentName && matchesTypeInList;
      });

      return { ...fieldDataTypeItem, disabled };
    });
  }, [name, type]);

  useLayoutEffect(() => {
    validateCustomField();
  }, []);

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
                // error={getFieldError(nameField)}
                label="Field Name"
                name={nameField.name}
                onValueChange={(value) => {
                  nameField.handleChange(value);
                  setName(value);
                  validateCustomField();
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
                // error={getFieldError(typeField)}
                items={customFieldDataTypeItems}
                label="Data Type"
                name={typeField.name}
                onValueChange={(value) => {
                  const type = value?.id;
                  if (type) {
                    typeField.handleChange(type);
                    setType(type);
                  }
                  validateCustomField();
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
