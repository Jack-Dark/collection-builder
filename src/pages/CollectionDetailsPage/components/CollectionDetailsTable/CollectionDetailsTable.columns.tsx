import type { AccessorKeyColumnDefBase } from '@tanstack/react-table';

import { createColumnHelper } from '@tanstack/react-table';
import { Fragment } from 'react/jsx-runtime';
import { v4 as uuidv4 } from 'uuid';

import type { CollectionItemRecordDef } from '#/api/routes/collection-items/collection-item.types';

import { CheckboxField } from '#/components/Fields/CheckboxField';
import { InputField } from '#/components/Fields/InputField';
import { SwitchField } from '#/components/Fields/SwitchField';
import { useEditingCollectionItemsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

import type { CreateOrUpdateCollectionItemFormRowDataDef } from '../../CollectionDetailsPage.types';
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

export const getCollectionItemsTableColumns = (
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
          const { getIsEditingRowId } = useEditingCollectionItemsRowIds();

          const isEditingRow = getIsEditingRowId(row.id);

          const customFieldValueForIndex = getValue()[customField.id];

          const key = customFieldValueForIndex?.id || customField?.id;

          return isEditingRow ? (
            <form.Field
              key={key}
              name={`collectionItems[${row.index}].customFieldValues.${customField.id}`}
            >
              {(field) => {
                return (
                  <>
                    {customField.type === 'boolean' && (
                      <div>
                        <SwitchField
                          checked={field.value?.value as boolean}
                          onCheckedChange={(value) => {
                            field.handleChange({
                              id: field.value?.id || uuidv4(),
                              value,
                            });
                          }}
                        />
                      </div>
                    )}
                    {customField.type === 'number' && (
                      <div>
                        <InputField
                          onValueChange={(value) => {
                            field.handleChange({
                              id: field.value?.id || uuidv4(),
                              value: Number(value),
                            });
                          }}
                          placeholder={`Input ${customField.name}...`}
                          type="number"
                          value={field.value?.value as number}
                        />
                      </div>
                    )}
                    {customField.type === 'string' && (
                      <div>
                        <InputField
                          onValueChange={(value) => {
                            field.handleChange({
                              id: field.value?.id || uuidv4(),
                              value,
                            });
                          }}
                          placeholder={`Input ${customField.name}...`}
                          value={field.value?.value as string}
                        />
                      </div>
                    )}
                  </>
                );
              }}
            </form.Field>
          ) : (
            <Fragment key={key}>
              {typeof customFieldValueForIndex?.value === 'boolean' &&
              customFieldValueForIndex?.value ? (
                <CheckboxField checked={customFieldValueForIndex?.value} />
              ) : (
                <p>{customFieldValueForIndex?.value || '-'}</p>
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
