import type { PropsWithChildren } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import { v4 as uuidv4 } from 'uuid';

import type { CustomFieldTypeDef } from '#/api/db-tables-schema.types';

import { useCreateCustomFields } from '#/api/routes/custom-fields/create-custom-fields/create-custom-fields.react-query';
import {
  useGetCustomFields,
  useInvalidateGetCustomFields,
} from '#/api/routes/custom-fields/get-custom-fields/get-custom-fields.react-query';
import { Button } from '#/components/Button';
import { Dialog } from '#/components/Dialog';
import { useDialog } from '#/components/Dialog/hooks/useDialog';
import { getCreateDefaultZustandStore } from '#/helpers/get-create-default-zustand-state';
import {
  collectionsListFormDefaultValues,
  withCollectionsListForm,
} from '#/pages/CollectionsListPage/CollectionsListPage.form';
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

const fieldTypeItems = [
  {
    id: null as unknown as CustomFieldTypeDef,
    label: 'Select data type...',
  },
  {
    id: 'number',
    label: 'Number',
  },
  {
    id: 'string',
    label: 'Text',
  },
  {
    id: 'boolean',
    label: 'True/False',
  },
] satisfies {
  id: CustomFieldTypeDef;
  label: string;
}[];

const getFieldItemLabel = (type: CustomFieldTypeDef) => {
  return (
    fieldTypeItems.find((fieldItem) => {
      return fieldItem.id === type;
    })?.label || '-'
  );
};

export const CollectionsListCustomFieldsCell = withCollectionsListForm({
  /** These values are only used for type-checking, and are not used at runtime */
  defaultValues: collectionsListFormDefaultValues,
  props: {
    index: 0,
    rowId: '',
    value: [] as CustomFieldFormItemDef[],
  },
  render: ({ form, index: rowIndex, rowId, value: customFields }) => {
    const { getIsEditingRowId } = useEditingCollectionsRowIds();

    const isEditingRow = getIsEditingRowId(rowId);

    const editCustomFieldAtom = useEditCustomFieldAtom();

    const [showAddOrEditCustomFieldsDialog, hideAddOrEditCustomFieldsDialog] =
      useDialog(() => {
        const lastAddedCustomField = useEditCustomFieldAtom();

        const customFieldAtIndexName =
          `records[${rowIndex}].customFields[${editCustomFieldAtom.index.value}]` as const;

        const { onCreateCustomFields, processing } = useCreateCustomFields();

        const invalidateGetCustomFields = useInvalidateGetCustomFields();

        return (
          <form.AppField
            mode="array"
            name={`records[${rowIndex}].customFields`}
          >
            {(customFieldsForRowFormField) => {
              const onCancel = () => {
                customFieldsForRowFormField.replaceValue(
                  lastAddedCustomField.index.value,
                  lastAddedCustomField.data.value,
                );
                hideAddOrEditCustomFieldsDialog();
              };

              const onSave = async () => {
                const customField =
                  customFieldsForRowFormField.state.value[
                    lastAddedCustomField.index.value
                  ];

                if (typeof customField.id === 'string') {
                  const [newRecord] = await onCreateCustomFields({
                    records: [
                      {
                        name: customField.name,
                        type: customField.type,
                      },
                    ],
                  });
                  customFieldsForRowFormField.replaceValue(
                    lastAddedCustomField.index.value,
                    {
                      id: newRecord.id,
                      name: newRecord.name,
                      type: newRecord.type,
                    },
                  );
                } else {
                  // TODO - ADD LOGIC TO UPDATE EXISTING FIELD
                }
                invalidateGetCustomFields();
                hideAddOrEditCustomFieldsDialog();
              };

              return (
                <Dialog
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
                          onClick={onSave}
                          processing={processing}
                          text="Save"
                        />
                      </>
                    );
                  }}
                  Header="Edit Custom Field"
                  onClose={onCancel}
                >
                  <div className="grid gap-4">
                    <form.AppField name={customFieldAtIndexName}>
                      {(customFieldAtIndexFormField) => {
                        return (
                          <>
                            <form.AppField
                              name={`${customFieldAtIndexName}.name`}
                            >
                              {(nameField) => {
                                return (
                                  <nameField.InputField
                                    autoFocus
                                    // error={getFieldError(nameField)}
                                    label="Column Name"
                                    name={nameField.name}
                                    onValueChange={nameField.handleChange}
                                    placeholder="Input column name..."
                                    value={nameField.state.value}
                                  />
                                );
                              }}
                            </form.AppField>

                            <form.AppField
                              name={`${customFieldAtIndexName}.type`}
                            >
                              {(typeField) => {
                                const value = fieldTypeItems.find(({ id }) => {
                                  return id === typeField.state.value;
                                });

                                return (
                                  <typeField.SelectField
                                    // error={getFieldError(typeField)}
                                    items={fieldTypeItems.map(
                                      (fieldTypeItem) => {
                                        const customFieldsForRow =
                                          customFieldsForRowFormField.state
                                            .value;
                                        const customFieldBeingEdited =
                                          customFieldAtIndexFormField.state
                                            .value;

                                        const disabled =
                                          customFieldsForRow.some(
                                            (selectedCustomField) => {
                                              return (
                                                !fieldTypeItem.id ||
                                                (selectedCustomField.name ===
                                                  customFieldBeingEdited.name &&
                                                  selectedCustomField.type ===
                                                    fieldTypeItem.id)
                                              );
                                            },
                                          );

                                        return { ...fieldTypeItem, disabled };
                                      },
                                    )}
                                    label="Data Type"
                                    name={typeField.name}
                                    onValueChange={(value) => {
                                      if (value?.id) {
                                        typeField.handleChange(value.id);
                                      }
                                    }}
                                    // placeholder="Select data type..."
                                    value={value}
                                  />
                                );
                              }}
                            </form.AppField>
                          </>
                        );
                      }}
                    </form.AppField>
                  </div>
                </Dialog>
              );
            }}
          </form.AppField>
        );
      }, []);

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

    return (
      <div>
        {isEditingRow ? (
          <form.AppField mode="array" name="records">
            {() => {
              return (
                <form.Subscribe
                  selector={(state) => {
                    state.values.records;
                    const unsavedCustomFields = state.values.records
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

                    const customFieldsForRow =
                      state.values.records[rowIndex].customFields;

                    return {
                      customFieldsForRow,
                      uniqueDisplayItems,
                    };
                  }}
                >
                  {({ customFieldsForRow, uniqueDisplayItems }) => {
                    return (
                      <form.AppField
                        mode="array"
                        name={`records[${rowIndex}].customFields`}
                      >
                        {(customFieldsForRowFormField) => {
                          return (
                            <div>
                              <customFieldsForRowFormField.ComboboxField
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
                                name={customFieldsForRowFormField.name}
                                onRemoveChip={({ id }) => {
                                  const matchingIndex =
                                    customFieldsForRowFormField.state.value.findIndex(
                                      (field) => {
                                        return field.id === id;
                                      },
                                    );
                                  customFieldsForRowFormField.removeValue(
                                    matchingIndex,
                                  );
                                }}
                                onValueChange={(customFields) => {
                                  const lastAddedIndex = customFields.findIndex(
                                    ({ id }) => {
                                      return (
                                        id === editCustomFieldAtom.data.value.id
                                      );
                                    },
                                  );

                                  if (lastAddedIndex >= 0) {
                                    editCustomFieldAtom.index.setValue(
                                      lastAddedIndex,
                                    );
                                    showAddOrEditCustomFieldsDialog();
                                  } else {
                                    editCustomFieldAtom.index.resetValue();
                                  }

                                  customFieldsForRowFormField.setValue(
                                    customFields,
                                  );
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
                                              customFieldsForRowFormField.state.value.findIndex(
                                                ({ id }) => {
                                                  return id === item.id;
                                                },
                                              );
                                            if (indexToEdit >= 0) {
                                              editCustomFieldAtom.index.setValue(
                                                indexToEdit,
                                              );
                                              editCustomFieldAtom.data.setValue(
                                                item,
                                              );

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
                                verifyShowNewItem={({
                                  itemMatchingQuery,
                                  newItem,
                                }) => {
                                  return (
                                    newItem.type !== itemMatchingQuery?.type
                                  );
                                }}
                              />
                            </div>
                          );
                        }}
                      </form.AppField>
                    );
                  }}
                </form.Subscribe>
              );
            }}
          </form.AppField>
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
  },
});

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
