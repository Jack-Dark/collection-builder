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
    onSuccess: async ({ affectedCollections, numAffectedCollectionItems }) => {
      if (!affectedCollections.length && !numAffectedCollectionItems) {
        await onDelete();
      }
    },
    placeholderData: (_data) => {
      return {
        affectedCollections: [],
        numAffectedCollectionItems: 0,
      } satisfies typeof _data;
    },
    requestArgs: {
      customFieldValueId: id,
    },
  });

  const { affectedCollections, numAffectedCollectionItems } = data;

  const invalidateGetCustomFieldValuesByCustomFieldId =
    useInvalidateGetCustomFieldValuesByCustomFieldId();

  const { onDeleteCustomFieldValues, processing } = useDeleteCustomFieldValues({
    onSuccess: async () => {
      await invalidateGetCustomFieldValuesByCustomFieldId();

      if (selectedCustomFieldValueId === id) {
        // TODO - FIELD IS NOT CORRECTLY CLEARED IF DELETING ITEM THAT IS CURRENTLY APPLIED
        handleFieldChange(undefined);
      }

      onClose();
    },
    showLoading: true,
  });

  const onDelete = async () => {
    await onDeleteCustomFieldValues({
      collectionItemId,
      ids: [id],
    });
  };

  return !affectedCollections.length && !numAffectedCollectionItems ? null : (
    <Dialog
      disableOnClose={processing}
      Footer={() => {
        return (
          <>
            <Button disabled={processing} onClick={onClose} variant="mono">
              Cancel
            </Button>
            <Button onClick={onDelete} processing={processing} variant="alert">
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

        {!!numAffectedCollectionItems && (
          <>
            <div className="grid gap-1">
              <p className="text-center text-sm text-gray-600">
                This will remove the custom field value from{' '}
                {numAffectedCollectionItems} collection{' '}
                {pluralize('item', numAffectedCollectionItems)}{' '}
                {pluralize('in', numAffectedCollectionItems, 'across')} the
                following {pluralize('collection', numAffectedCollectionItems)}:
              </p>

              <div className="flex justify-center">
                <ul className="list-inside list-disc">
                  {affectedCollections.map(({ id, name }) => {
                    return (
                      <li key={id}>
                        <span>{name}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="grid gap-1">
              <p className="max-w-100 text-gray-600 text-sm text-center">
                Note: This will delete the custom field value, even if changes
                to your collection are dismissed.
              </p>

              <p className="text-center text-sm text-gray-600">
                <em>This cannot be undone.</em>
              </p>
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
};
