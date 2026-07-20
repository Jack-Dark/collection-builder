import type { RouteComponent } from '@tanstack/react-router';

import { useEffect } from 'react';

import type { CollectionRecordDef } from '#/api/routes/collections/collection.types';

import { useCreateCollection } from '#/api/routes/collections/create-collection/create-collection.react-query';
import {
  useGetPaginatedCollections,
  useInvalidateGetPaginatedCollections,
} from '#/api/routes/collections/get-paginated-collections/get-paginated-collections.react-query';
import { useUpdateCollectionById } from '#/api/routes/collections/update-collection-by-id/update-collection-by-id.react-query';
import { useSpinner } from '#/components/FullPageLoadingSpinner/useSpinner';
import { PageWrapper } from '#/page-wrapper';
import { createOrUpdateCollectionFormSchema } from '#/pages/CollectionsListPage/collection-form.schema';
import { Route as CollectionsListRoute } from '#/routes/_protected/collections';

import {
  collectionsListFormDefaultValues,
  useCollectionsListForm,
} from './CollectionsListPage.form';
import { CollectionsListTable } from './components/CollectionsListTable/CollectionsListTable';
import { useEditingCollectionsRowIds } from './hooks/use-editing-collections-row-ids';

export const CollectionsListPage: RouteComponent = () => {
  const searchQueries = CollectionsListRoute.useSearch();

  const { onInterceptProcessingRequest, processing, toggleSpinner } =
    useSpinner();

  const invalidateGetPaginatedCollections =
    useInvalidateGetPaginatedCollections();

  const { onCreateCollection } = useCreateCollection({});

  const { onUpdateCollectionById } = useUpdateCollectionById({});

  const { data } = useGetPaginatedCollections({
    onSuccess: ({ collections }) => {
      form.setFieldValue('records', collections);
    },
    requestArgs: { params: searchQueries },
  });

  const { resetEditingRowIds } = useEditingCollectionsRowIds();

  const form = useCollectionsListForm({
    defaultValues: data?.collections
      ? {
          records: data.collections.map((collection) => {
            return { ...collection, isEditing: false };
          }),
        }
      : collectionsListFormDefaultValues,
    onSubmit: async ({ value: { records } }) => {
      await onInterceptProcessingRequest(async () => {
        const editedRecords = records.filter(({ isEditing }) => {
          return isEditing;
        });

        const isUpdatedRecords = editedRecords.some(({ createdAt }) => {
          return createdAt;
        });

        if (isUpdatedRecords) {
          await onUpdateCollectionById(editedRecords as CollectionRecordDef[]);
        } else {
          const newRecords = editedRecords.map((record) => {
            const {
              createdAt: _createdAt,
              id,
              updatedAt: _updatedAt,
              userId: _userId,
              ...newCollectionData
            } = record;

            return { ...newCollectionData, id: String(id) };
          });
          await onCreateCollection({ records: newRecords });
        }

        resetEditingRowIds();
        await invalidateGetPaginatedCollections();
      });
    },
    validators: {
      onChange: createOrUpdateCollectionFormSchema,
      onSubmit: createOrUpdateCollectionFormSchema,
    },
  });

  useEffect(() => {
    toggleSpinner(processing);
  }, [processing]);

  return (
    <PageWrapper title="Collections">
      <form>
        <CollectionsListTable form={form} />
      </form>
    </PageWrapper>
  );
};
