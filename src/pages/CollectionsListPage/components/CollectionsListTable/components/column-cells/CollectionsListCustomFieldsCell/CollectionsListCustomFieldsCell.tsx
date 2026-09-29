import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useForm } from '@tanstack/react-form';
import { Fragment } from 'react/jsx-runtime';
import { v4 as uuidv4 } from 'uuid';
import z from 'zod';

import type {
  CustomFieldRecordDef,
  CustomFieldTypeDef,
} from '#/api/db-tables-schema.types';

import { useCreateCustomFields } from '#/api/routes/custom-fields/create-custom-fields/create-custom-fields.react-query';
import { baseCustomFieldSchema } from '#/api/routes/custom-fields/custom-fields.schema';
import { Button } from '#/components/Button';
import { Dialog } from '#/components/Dialog';
import { useDialog } from '#/components/Dialog/hooks/useDialog';
import { InputField } from '#/components/Fields/InputField';
import { SelectField } from '#/components/Fields/SelectField';
import { getFieldError } from '#/helpers/get-field-error';
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

const createOrUpdateCustomFieldsFormSchema = z.object({
  records: z.union([
    z.array(
      baseCustomFieldSchema.extend({
        id: z.string().min(1).describe('ID'),
      }),
    ),
    z.array(
      baseCustomFieldSchema.extend({
        id: z.number().min(1).describe('ID'),
      }),
    ),
  ]),
});

export const CollectionsListCustomFieldsCell = (props: {
  collectionId: number;
  customFields: CustomFieldFormItemDef[];
  onSubmit: (customFieldIds: number[]) => void;
  rowId: string;
}) => {
  const { collectionId, customFields, onSubmit, rowId } = props;

  const { getIsEditingRowId } = useEditingCollectionsRowIds();

  const isEditingRow = getIsEditingRowId(rowId);

  const onCancel = () => {
    hideAddOrEditCustomFieldsDialog();
    form.reset();
  };

  const { onCreateCustomFields, processing: processingCreate } =
    useCreateCustomFields();

  const form = useForm({
    defaultValues: {
      records: customFields.length
        ? customFields
        : ([
            {
              id: uuidv4(),
              name: '',
              type: 'string',
            },
          ] satisfies CustomFieldFormItemDef[]),
    },
    onSubmit: async ({ value }) => {
      const { recordsToCreate, recordsToUpdate } = value.records.reduce<{
        recordsToCreate: (CustomFieldFormItemDef & { collectionId: number })[];
        recordsToUpdate: (CustomFieldFormItemDef & { collectionId: number })[];
      }>(
        (acc, record) => {
          if (typeof record.id === 'string') {
            return {
              ...acc,
              recordsToCreate: [
                ...acc.recordsToCreate,
                { ...record, collectionId },
              ],
            };
          } else {
            return {
              ...acc,
              recordsToUpdate: [
                ...acc.recordsToUpdate,
                { ...record, collectionId },
              ],
            };
          }
        },
        { recordsToCreate: [], recordsToUpdate: [] },
      );

      let finalRecords: CustomFieldRecordDef[] = [];

      // ? Create new records
      if (recordsToCreate.length) {
        const records = recordsToCreate.map(({ id: _id, ...rest }) => {
          return rest;
        });
        const newRecords = await onCreateCustomFields({
          records,
        });

        finalRecords = [...finalRecords, ...newRecords];
      }

      // ? Update existing records
      if (recordsToUpdate.length) {
        // TODO UPDATE LOGIC HERE
        // const recordsToUpdate = value.records.map(({ name, type }) => {
        //   return { name, type };
        // });
        // const newRecords = await onUpdateCustomFields({
        //   records: recordsToUpdate,
        // });
        // finalRecords = [...finalRecords, ...newRecords]
      }

      onSubmit(
        finalRecords.map(({ id }) => {
          return id;
        }),
      );

      hideAddOrEditCustomFieldsDialog();
    },
    validators: {
      onChange: createOrUpdateCustomFieldsFormSchema,
      onSubmit: createOrUpdateCustomFieldsFormSchema,
    },
  });

  const [showAddOrEditCustomFieldsDialog, hideAddOrEditCustomFieldsDialog] =
    useDialog(() => {
      return (
        <Dialog
          Footer={() => {
            return (
              <>
                <Button onClick={onCancel} text="Cancel" variant="mono" />
                <Button
                  onClick={form.handleSubmit}
                  processing={processingCreate}
                  text="Save"
                />
              </>
            );
          }}
          Header="[Add/Edit] Custom Field"
          onClose={onCancel}
        >
          <form>
            <div className="grid gap-4">
              <form.Field mode="array" name="records">
                {(recordField) => {
                  return recordField.state.value.map(({ id }, index) => {
                    return (
                      <Fragment key={id}>
                        <form.Field name={`records[${index}].name`}>
                          {(nameField) => {
                            return (
                              <InputField
                                error={getFieldError(nameField)}
                                label="Column Name"
                                name={nameField.name}
                                onValueChange={nameField.handleChange}
                                placeholder="Input..."
                                value={nameField.state.value}
                              />
                            );
                          }}
                        </form.Field>

                        <form.Field name={`records[${index}].type`}>
                          {(typeField) => {
                            return (
                              <SelectField
                                error={getFieldError(typeField)}
                                items={fieldTypeItems}
                                label="Data Type"
                                name={typeField.name}
                                onValueChange={(value) => {
                                  if (value?.id) {
                                    typeField.handleChange(value.id);
                                  }
                                }}
                                placeholder="Select..."
                                value={fieldTypeItems.find(({ id }) => {
                                  return id === typeField.state.value;
                                })}
                              />
                            );
                          }}
                        </form.Field>
                      </Fragment>
                    );
                  });
                }}
              </form.Field>
            </div>
          </form>
        </Dialog>
      );
    }, []);

  return (
    <div>
      {customFields.length
        ? customFields.map(({ id, name, type }) => {
            return (
              <span
                className="group/controls flex items-center gap-2 flex-wrap"
                key={id}
              >
                <span className="whitespace-nowrap" key={id}>
                  <span>{name}</span>{' '}
                  <span className="text-xs">({getFieldItemLabel(type)})</span>
                </span>

                {isEditingRow && (
                  <span className="group-hover/controls:flex hidden items-center gap-1">
                    <span
                      className="text-gray-500 hover:text-primary-800 cursor-pointer"
                      onClick={showAddOrEditCustomFieldsDialog}
                    >
                      <EditIcon fontSize="inherit" />
                    </span>
                    <span
                      className="text-gray-500 hover:text-red-600 cursor-pointer"
                      // todo - add delete onClick logic
                    >
                      <DeleteIcon fontSize="inherit" />
                    </span>
                  </span>
                )}
              </span>
            );
          })
        : '-'}
    </div>
  );
};
