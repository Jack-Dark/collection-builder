import type { RouteComponent } from '@tanstack/react-router';

import { revalidateLogic } from '@tanstack/react-form';
import { useRouter } from '@tanstack/react-router';
import { create } from 'zustand';

import {
  useCreateCollection,
  useUpdateCollection,
} from '#/api/routes/collections/client/hooks';
import { createCollectionSchema } from '#/api/routes/collections/server/serverFns';
import { Button } from '#/components/Button';
import { Table } from '#/components/Table';
import { PageWrapper } from '#/page-wrapper';
import { Route } from '#/routes/_protected/collections';

import type { AddCollectionFormSchemaDef } from './components/AddCollectionForm/types';

import { getCollectionsListTableColumns } from './columns';
import { AddCollectionFormTableRow } from './components/AddCollectionForm';
import {
  addCollectionFormDefaultValues,
  useAddCollectionForm,
} from './components/AddCollectionForm/constants';
import { useEditingCollectionsRowIds } from './hooks/use-editing-collections-row-ids';

export const useCollectionsListFormStore = create<{
  collectionFormValues: AddCollectionFormSchemaDef;
  resetCollectionFormValues: () => void;
  setCollectionFormValues: (values: AddCollectionFormSchemaDef) => void;
}>((set) => {
  return {
    collectionFormValues: addCollectionFormDefaultValues,
    resetCollectionFormValues: () => {
      set({
        collectionFormValues: addCollectionFormDefaultValues,
      });
    },
    setCollectionFormValues: (values) => {
      set({
        collectionFormValues: values,
      });
    },
  };
});

export const CollectionsListPage: RouteComponent = () => {
  const collections = Route.useLoaderData();

  const router = useRouter();

  const { collectionFormValues, resetCollectionFormValues } =
    useCollectionsListFormStore();

  const { onCreateCollection } = useCreateCollection({
    onSuccess: () => {
      resetCollectionFormValues();
    },
  });

  const { onUpdateCollection } = useUpdateCollection({
    onSuccess: () => {
      resetCollectionFormValues();
    },
  });

  const form = useAddCollectionForm({
    defaultValues: collectionFormValues,
    onSubmit: async ({ value }) => {
      if (!!value?.id && !!value?.userId) {
        await onUpdateCollection({
          data: {
            ...value,
            // id and userId added long-hand to solve type errors
            id: value.id,
            userId: value.userId,
          },
        });
      } else {
        await onCreateCollection({
          data: value,
        });
      }

      form.reset();

      await router.invalidate();

      // nameInputRef?.current?.focus();
    },
    validationLogic: revalidateLogic({
      mode: 'submit',
      modeAfterSubmission: 'change',
    }),
    validators: {
      onSubmit: createCollectionSchema,
    },
  });

  const { isEditing, resetEditingRowIds } = useEditingCollectionsRowIds();

  const columns = getCollectionsListTableColumns();

  return (
    <PageWrapper title="Collections">
      <div className="grid grid-cols-1 gap-4">
        {!isEditing && (
          <div>
            <Button
              onClick={() => {
                // TODO - RESET NOT APPLICABLE HERE
                resetEditingRowIds();
              }}
              text="Add New Collection"
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
                    <AddCollectionFormTableRow
                      form={form}
                      onCancel={() => {
                        resetEditingRowIds();
                      }}
                      // tdClassNames={`${tdClassNames} align-items-center min-h-[501px]`}
                      {...props}
                    />
                  );
                }
              : undefined
          }
          columns={columns}
          data={collections.data}
        />
      </form>
    </PageWrapper>
  );
};
