import type { PropsWithChildren } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import { v4 as uuidv4 } from 'uuid';

import type { CustomFieldTypeDef } from '#/api/db-tables-schema.types';

import { useGetCustomFields } from '#/api/routes/custom-fields/get-custom-fields/get-custom-fields.react-query';
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

        return (
          <form.AppField
            mode="array"
            name={`records[${rowIndex}].customFields`}
          >
            {(field) => {
              const onCancel = () => {
                field.replaceValue(
                  lastAddedCustomField.index.value,
                  lastAddedCustomField.data.value,
                );
                hideAddOrEditCustomFieldsDialog();
              };

              return (
                <Dialog
                  Footer={() => {
                    return (
                      <>
                        <Button
                          onClick={onCancel}
                          text="Cancel"
                          variant="mono"
                        />
                        <Button
                          onClick={hideAddOrEditCustomFieldsDialog}
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
                      {() => {
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
                                return (
                                  <typeField.SelectField
                                    // error={getFieldError(typeField)}
                                    items={fieldTypeItems}
                                    label="Data Type"
                                    name={typeField.name}
                                    onValueChange={(value) => {
                                      if (value?.id) {
                                        typeField.handleChange(value.id);
                                      }
                                    }}
                                    placeholder="Select data type..."
                                    value={fieldTypeItems.find(({ id }) => {
                                      return id === typeField.state.value;
                                    })}
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

    const { data: allCustomFields } = useGetCustomFields({
      initialData: [],
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
                    return {
                      customFieldValues:
                        state.values.records[rowIndex].customFields,
                    };
                  }}
                >
                  {({ customFieldValues }) => {
                    return (
                      <form.AppField
                        mode="array"
                        name={`records[${rowIndex}].customFields`}
                      >
                        {(field) => {
                          return (
                            <div>
                              <field.ComboboxField
                                allowCreatable
                                createItem={(name) => {
                                  const newRecord: CustomFieldFormItemDef = {
                                    id: uuidv4(),
                                    name,
                                    type: 'string',
                                  };

                                  editCustomFieldAtom.data.setValue(newRecord);

                                  return newRecord;
                                }}
                                idProperty="id"
                                isItemEqualToValue={(item, value) => {
                                  return item?.id === value?.id;
                                }}
                                items={allCustomFields}
                                labelProperty="name"
                                multiple
                                name={field.name}
                                onRemoveChip={({ id }) => {
                                  const matchingIndex =
                                    field.state.value.findIndex((field) => {
                                      return field.id === id;
                                    });
                                  field.removeValue(matchingIndex);
                                }}
                                onValueChange={(customFields) => {
                                  const lastAddedIndex = customFields.findIndex(
                                    ({ id }) => {
                                      return (
                                        id === editCustomFieldAtom.data.value.id
                                      );
                                    },
                                  );
                                  console.log(
                                    '🚀 ~ lastAddedIndex:',
                                    lastAddedIndex,
                                  );

                                  if (lastAddedIndex >= 0) {
                                    editCustomFieldAtom.index.setValue(
                                      lastAddedIndex,
                                    );
                                    showAddOrEditCustomFieldsDialog();
                                  } else {
                                    editCustomFieldAtom.index.resetValue();
                                  }

                                  field.setValue(customFields);
                                }}
                                placeholder="Input custom fields..."
                                RenderChip={({ item }) => {
                                  return (
                                    <RenderItem {...item}>
                                      <span className="hover:text-primary-700 cursor-pointer leading-0">
                                        <EditIcon
                                          fontSize="inherit"
                                          onClick={() => {
                                            const indexToEdit =
                                              field.state.value.findIndex(
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
                                  return <RenderItem {...item} />;
                                }}
                                value={customFieldValues}
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
                <RenderItem {...item} />
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

const RenderItem = (props: PropsWithChildren<CustomFieldFormItemDef>) => {
  const { children, id, name, type } = props;

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
