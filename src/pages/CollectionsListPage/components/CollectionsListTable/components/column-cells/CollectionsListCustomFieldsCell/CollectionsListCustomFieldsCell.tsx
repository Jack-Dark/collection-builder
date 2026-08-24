import { useForm } from '@tanstack/react-form';
import { Fragment } from 'react/jsx-runtime';
import { v4 as uuidv4 } from 'uuid';
import z from 'zod';

import type { CustomFieldTypeDef } from '#/api/db-tables-schema.types';

import { baseCustomFieldSchema } from '#/api/routes/collections/base-collection.schema';
import { Button } from '#/components/Button';
import { Dialog } from '#/components/Dialog';
import { useDialog } from '#/components/Dialog/hooks/useDialog';
import { InputField } from '#/components/Fields/InputField';
import { SelectField } from '#/components/Fields/SelectField';
import { getFieldError } from '#/helpers/get-field-error';
import { useEditingCollectionsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

type CustomFieldFormItemsDef =
  | {
      id: number;
      name: string;
      type: CustomFieldTypeDef;
    }[]
  | {
      id: string;
      name: string;
      type: CustomFieldTypeDef;
    }[];

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
  customFields: CustomFieldFormItemsDef;
  onSubmit: (customFieldIds: number[]) => void;
  rowId: string;
}) => {
  const { customFields, onSubmit, rowId } = props;

  const { getIsEditingRowId } = useEditingCollectionsRowIds();

  const isEditingRow = getIsEditingRowId(rowId);

  const onCancel = () => {
    hideAddOrEditCustomFieldsDialog();
    form.reset();
  };

  const form = useForm({
    defaultValues: {
      records: customFields.length
        ? customFields
        : [
            {
              id: uuidv4(),
              name: '',
              type: 'string',
            },
          ],
    },
    onSubmit: async ({ value }) => {
      // TODO - ADD CREATE CUSTOM FIELDS LOGIC
      // onSubmit(customFieldIds)
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
                <Button onClick={form.handleSubmit} text="Save" />
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

  return isEditingRow ? (
    <Button onClick={showAddOrEditCustomFieldsDialog} text="[TOGGLE DIALOG]" />
  ) : (
    <p>
      {customFields.length
        ? customFields
            .map(({ name, type }) => {
              return `${name}: ${type}`;
            })
            .join()
        : '-'}
    </p>
  );
};
