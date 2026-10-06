import type { AnyFieldApi } from '@tanstack/react-form';

import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import type { CustomFieldTypeDef } from '#/api/db-tables-schema.types';

import { useCreateCustomFieldValues } from '#/api/routes/custom-field-values/create-custom-field-value/create-custom-field-value.react-query';
import {
  useGetCustomFieldValuesByCustomFieldId,
  useInvalidateGetCustomFieldValuesByCustomFieldId,
} from '#/api/routes/custom-field-values/get-custom-field-values-by-collection-id/get-custom-field-values-by-collection-id.react-query';
import { Button } from '#/components/Button';
import { useDialog } from '#/components/Dialog/hooks/useDialog';
import { ComboboxField } from '#/components/Fields/ComboboxField';

import type { CreateOrUpdateCollectionItemFormTypeDef } from '../../../../../../../CollectionDetailsPage.types';

import { useSubscribeToCustomFieldValue } from '../../hooks/subscribe-to-custom-field-value';
import { DeleteCustomFieldValueDialog } from './components/DeleteCustomFieldValueDialog';

type CustomFieldValueComboboxPropsDef<TField extends AnyFieldApi> = {
  collectionItemId: number | string;
  customField: {
    id: number;
    name: string;
    type: CustomFieldTypeDef;
  };
  /** The specific custom field value form field where this component renders */
  field: TField;
  form: CreateOrUpdateCollectionItemFormTypeDef;
  rowIndex: number;
};

export const CustomFieldValueCombobox = <TField extends AnyFieldApi>({
  collectionItemId,
  customField,
  field,
  form,
  rowIndex,
}: CustomFieldValueComboboxPropsDef<TField>) => {
  const [customFieldValueToDelete, setCustomFieldValueToDelete] = useState<{
    id: number;
    value: string;
  }>();

  const { data, isFetching } = useGetCustomFieldValuesByCustomFieldId({
    placeholderData: [],
    requestArgs: {
      id: customField.id,
    },
  });
  const invalidateGetCustomFieldValuesByCustomFieldId =
    useInvalidateGetCustomFieldValuesByCustomFieldId();

  const items = useMemo(() => {
    // TODO - REFACTOR USEQUERY TRANSFORM AND UPDATE  TO USE THAT. ONSUCCESS IS ALSO RETURNING NEVER[] FOR SOME REASON. INVESTIGATE.
    return data.map(({ data, id }) => {
      return { id, value: data.value as string };
    });
  }, [data]);

  const { onCreateCustomFieldValues, processing } = useCreateCustomFieldValues({
    onSuccess: () => {
      invalidateGetCustomFieldValuesByCustomFieldId({
        id: customField.id,
      });
    },
  });

  const customFieldValue = useSubscribeToCustomFieldValue<string, typeof form>({
    customFieldId: customField.id,
    form,
    rowIndex,
  });

  const [showDeleteCustomFieldValueDialog, hideCustomFieldValueDialog] =
    useDialog(() => {
      return (
        customFieldValueToDelete && (
          <DeleteCustomFieldValueDialog
            collectionItemId={collectionItemId}
            customFieldValueToDelete={customFieldValueToDelete}
            handleFieldChange={field.handleChange}
            onClose={hideCustomFieldValueDialog}
            selectedCustomFieldValueId={customFieldValue?.id}
          />
        )
      );
    }, [customFieldValueToDelete, customFieldValue?.id]);

  return (
    <ComboboxField
      allowCreatable
      ariaLabel={customField.name}
      caseSensitiveCreation
      createNewItem={(label) => {
        return {
          // typing as number to resolve inferred type errors
          id: uuidv4() as unknown as number,
          value: label,
        };
      }}
      disabled={isFetching || processing}
      idProperty="id"
      inputValue={customFieldValue?.data?.value}
      items={items}
      labelProperty="value"
      name={field.name}
      onValueChange={async (selectedItem) => {
        if (selectedItem) {
          const customFieldValueExistsInDB =
            typeof selectedItem.id === 'number';

          const matchesCurrentSelection =
            customFieldValue?.id === selectedItem.id;
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
            const [newCustomFieldValue] = await onCreateCustomFieldValues({
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
        customFieldValue
          ? {
              id: customFieldValue.id,
              value: customFieldValue.data.value,
            }
          : undefined
      }
    />
  );
};
