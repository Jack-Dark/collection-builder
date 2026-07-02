import type { RouteComponent } from '@tanstack/react-router';

import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { revalidateLogic } from '@tanstack/react-form';
import { useRouter } from '@tanstack/react-router';
import { useEffect } from 'react';
import { create } from 'zustand';

import {
  useCreateCollectionItem,
  useUpdateCollectionItem,
} from '#/api/routes/collection-items/client/hooks';
import { collectionItemFormSchema } from '#/api/routes/collection-items/server/serverFns';
import { Button } from '#/components/Button';
import { Table } from '#/components/Table';
import { PageWrapper } from '#/page-wrapper';
import { Route as CollectionRoute } from '#/routes/_protected/collections/$id';

import type { AddCollectionItemFormSchemaDef } from './components/AddCollectionItemForm/types';

import { useEditingCollectionItemsRowIds } from '../CollectionsListPage/hooks/use-editing-collections-row-ids';
import { getCollectionItemsTableColumns } from './columns';
import { AddCollectionItemFormTableRow } from './components/AddCollectionItemForm';
import {
  addCollectionItemFormDefaultValues,
  useAddCollectionItemForm,
} from './components/AddCollectionItemForm/constants';

export const useCollectionItemsFormStore = create<{
  collectionItemFormValues: AddCollectionItemFormSchemaDef;
  resetCollectionItemFormValues: () => void;
  setCollectionItemFormValues: (values: AddCollectionItemFormSchemaDef) => void;
}>((set) => {
  return {
    collectionItemFormValues: addCollectionItemFormDefaultValues,
    resetCollectionItemFormValues: () => {
      set({
        collectionItemFormValues: addCollectionItemFormDefaultValues,
      });
    },
    setCollectionItemFormValues: (values) => {
      set({
        collectionItemFormValues: values,
      });
    },
  };
});

export const CollectionItemsPage: RouteComponent = () => {
  const { collection, customFields, items, lastAddedItem } =
    CollectionRoute.useLoaderData();

  const router = useRouter();

  const {
    collectionItemFormValues,
    resetCollectionItemFormValues,
    setCollectionItemFormValues,
  } = useCollectionItemsFormStore();

  const { onCreateCollectionItem } = useCreateCollectionItem({
    onSuccess: () => {
      resetCollectionItemFormValues();
    },
  });

  const { onUpdateCollectionItem } = useUpdateCollectionItem({
    onSuccess: () => {
      resetCollectionItemFormValues();
    },
  });

  const { addToEditingRowIds, isEditing, resetEditingRowIds } =
    useEditingCollectionItemsRowIds();

  const form = useAddCollectionItemForm({
    defaultValues: collectionItemFormValues,
    onSubmit: async ({ value }) => {
      if (value.id) {
        await onUpdateCollectionItem({
          data: value,
        });

        resetEditingRowIds();
      } else {
        await onCreateCollectionItem({
          data: {
            // undefined values added long-hand to resolve type errors
            ...value,
            createdAt: undefined,
            id: undefined,
            userId: undefined,
          },
        });
      }

      form.reset();

      await router.invalidate();
    },
    validationLogic: revalidateLogic({
      mode: 'submit',
      modeAfterSubmission: 'change',
    }),
    validators: {
      onSubmit: collectionItemFormSchema,
    },
  });

  const columns = getCollectionItemsTableColumns(collection);

  useEffect(() => {
    setCollectionItemFormValues({
      ...collectionItemFormValues,
      collectionId: collection.id,
      customField1Value: lastAddedItem?.customField1Value || '',
      customField2Value: lastAddedItem?.customField2Value || '',
      customField3Value: lastAddedItem?.customField3Value || '',
      notes: collectionItemFormValues.notes || '',
    });
  }, [lastAddedItem]);

  useEffect(() => {
    form.reset();
  }, [isEditing]);

  return (
    <PageWrapper childrenClassName="grid gap-8" title={collection?.name || '-'}>
      <div className="grid grid-cols-1 gap-4">
        {!isEditing && (
          <div className="flex justify-end">
            <Button
              Icon={ControlPointIcon}
              onClick={() => {
                addToEditingRowIds('');
              }}
              text="Add New"
              variant="secondary"
            />
          </div>
        )}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <Table
          BodyTopRow={
            isEditing
              ? (props) => {
                  return (
                    <AddCollectionItemFormTableRow
                      customField1Enabled={collection.customField1Enabled}
                      customField1Label={collection.customField1Label || ''}
                      customField2Enabled={collection.customField2Enabled}
                      customField2Label={collection.customField2Label || ''}
                      customField3Enabled={collection.customField3Enabled}
                      customField3Label={collection.customField3Label || ''}
                      customFields={customFields}
                      form={form}
                      onCancel={() => {
                        resetEditingRowIds();
                        resetCollectionItemFormValues();
                        form.reset();
                      }}
                      // tdClassNames={`${tdClassNames} align-items-center min-h-[501px]`}
                      {...props}
                    />
                  );
                }
              : undefined
          }
          columns={columns}
          data={items || []}
        />
      </form>
    </PageWrapper>
  );
};
