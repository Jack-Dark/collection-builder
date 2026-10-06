import type { AnyFieldApi } from '@tanstack/react-form';

import type { HideDialog } from '#/components/Dialog/hooks/useDialog';

import { useGetCollectionItemsWithCustomFieldValue } from '#/api/routes/collection-items/get-collection-items-with-custom-field-value/get-collection-items-with-custom-field-value.react-query';
import { useDeleteCustomFieldValues } from '#/api/routes/custom-field-values/delete-custom-field-values/delete-custom-field-values.react-query';
import { useInvalidateGetCustomFieldValuesByCustomFieldId } from '#/api/routes/custom-field-values/get-custom-field-values-by-collection-id/get-custom-field-values-by-collection-id.react-query';
import { Button } from '#/components/Button';
import { Dialog } from '#/components/Dialog';
import { pluralize } from '#/helpers/pluralize';

type DeleteCustomFieldValueDialogPropsDef<
  THandleFieldChange extends AnyFieldApi['handleChange'],
> = {
  collectionItemId: number | string;
  customFieldValueToDelete: {
    id: number;
    value: string;
  };
  handleFieldChange: THandleFieldChange;
  onClose: HideDialog;
  selectedCustomFieldValueId: number | undefined;
};

export const DeleteCustomFieldValueDialog = <
  THandleFieldChange extends AnyFieldApi['handleChange'],
>(
  props: DeleteCustomFieldValueDialogPropsDef<THandleFieldChange>,
) => {
  const {
    collectionItemId,
    customFieldValueToDelete,
    handleFieldChange,
    onClose,
    selectedCustomFieldValueId,
  } = props;

  const id = Number(customFieldValueToDelete.id);

  const { data } = useGetCollectionItemsWithCustomFieldValue({
    placeholderData: (_data) => {
      return {
        affectedCollections: [],
        numAffectedCollectionItems: 0,
      } satisfies typeof _data;
    },
    requestArgs: {
      id,
    },
  });

  const invalidateGetCustomFieldValuesByCustomFieldId =
    useInvalidateGetCustomFieldValuesByCustomFieldId();

  const { onDeleteCustomFieldValues, processing } = useDeleteCustomFieldValues({
    onSuccess: async () => {
      await invalidateGetCustomFieldValuesByCustomFieldId();

      if (selectedCustomFieldValueId === id) {
        // TODO - FIELD IS NOT CORRECTLY CLEARED IF DELETING ITEM THAT WAS JUST CREATED
        handleFieldChange(undefined);
      }

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
      onClose={onClose}
    >
      <div className="grid gap-4 content-center h-full">
        <p className="text-center">
          Are you sure you want to delete this custom field value?
        </p>

        <h4 className="text-center">{customFieldValueToDelete.value}</h4>

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
