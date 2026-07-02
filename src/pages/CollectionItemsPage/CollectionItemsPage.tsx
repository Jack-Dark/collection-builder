import type { RouteComponent } from '@tanstack/react-router';

import { revalidateLogic } from '@tanstack/react-form';
import { useState } from 'react';

import { createCollectionItemSchema } from '#/api/routes/collection-items/server/serverFns';
import { Button } from '#/components/Button';
import { Table } from '#/components/Table';
import { PageWrapper } from '#/page-wrapper';
import { Route as CollectionRoute } from '#/routes/_protected/collections/$id';

import { useEditingCollectionItemsRowIds } from '../CollectionsListPage/hooks/use-editing-collections-row-ids';
import { getCollectionItemsTableColumns } from './columns';
import {
  AddCollectionItemForm,
  AddCollectionItemFormTableRow,
} from './components/AddCollectionItemForm';
import {
  addCollectionItemFormDefaultValues,
  useAddCollectionItemForm,
} from './components/AddCollectionItemForm/constants';

export const CollectionPage: RouteComponent = () => {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const { collection, customFields, items, lastAddedItem } =
    CollectionRoute.useLoaderData();

  const toggleForm = () => {
    setShowAddForm((prev) => {
      return !prev;
    });
  };

  const form = useAddCollectionItemForm({
    defaultValues: addCollectionItemFormDefaultValues,
    onSubmit: async ({ value }) => {
      // if (!!value?.id && !!value?.userId) {
      //   await onUpdateCollection({
      //     data: {
      //       ...value,
      //       // id and userId added long-hand to solve type errors
      //       id: value.id,
      //       userId: value.userId,
      //     },
      //   });
      // } else {
      //   await onCreateCollection({
      //     data: value,
      //   });
      // }
      // form.reset();
      // await router.invalidate();
      // nameInputRef?.current?.focus();
    },
    validationLogic: revalidateLogic({
      mode: 'submit',
      modeAfterSubmission: 'change',
    }),
    validators: {
      onSubmit: createCollectionItemSchema,
    },
  });

  const { addToEditingRowIds, isEditing, resetEditingRowIds } =
    useEditingCollectionItemsRowIds();

  return (
    <PageWrapper childrenClassName="grid gap-8" title={collection?.name || '-'}>
      {showAddForm ? (
        <div className="grid gap-4">
          <Button
            className="justify-self-start flex flex-nowrap gap-2"
            onClick={toggleForm}
            text="Cancel"
            variant="secondary"
          />

          <AddCollectionItemForm
            collectionId={collection.id}
            customField1Enabled={collection.customField1Enabled}
            customField1Label={collection.customField1Label || ''}
            customField2Enabled={collection.customField2Enabled}
            customField2Label={collection.customField2Label || ''}
            customField3Enabled={collection.customField3Enabled}
            customField3Label={collection.customField3Label || ''}
            customFields={customFields}
            lastAddedItem={lastAddedItem}
          />
        </div>
      ) : (
        <Button
          className="justify-self-start"
          onClick={toggleForm}
          text="Add Item"
          variant="primary"
        />
      )}

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
                      collectionId={collection.id}
                      customField1Enabled={collection.customField1Enabled}
                      // tdClassNames={`${tdClassNames} align-items-center min-h-[501px]`}
                      customField1Label={collection.customField1Label || ''}
                      customField2Enabled={collection.customField2Enabled}
                      customField2Label={collection.customField2Label || ''}
                      customField3Enabled={collection.customField3Enabled}
                      customField3Label={collection.customField3Label || ''}
                      customFields={customFields}
                      form={form}
                      lastAddedItem={lastAddedItem}
                      onCancel={() => {
                        resetEditingRowIds();
                      }}
                      {...props}
                    />
                  );
                }
              : undefined
          }
          columns={getCollectionItemsTableColumns(collection)}

          data={items || []}
        />
      </form>
    </PageWrapper>
  );
};
