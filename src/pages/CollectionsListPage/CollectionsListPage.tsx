import type { RouteComponent } from '@tanstack/react-router';

import { useForm } from '@tanstack/react-form';
import { useBlocker } from '@tanstack/react-router';
import { useEffect } from 'react';

import type { UpdateCollectionsFormRecordSchemaDef } from '#/api/routes/collections/update-collection-by-id/update-collection-by-id.types';

import { getPaginationMetadataDefaults } from '#/api/pagination/pagination.constants';
import { useInvalidateGetCollectionDetailsById } from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.react-query';
import { useCreateCollection } from '#/api/routes/collections/create-collection/create-collection.react-query';
import { useInvalidateGetNavMenuCollections } from '#/api/routes/collections/get-nav-menu-collections/get-nav-menu-collections.react-query';
import {
  useGetPaginatedCollections,
  useInvalidateGetPaginatedCollections,
} from '#/api/routes/collections/get-paginated-collections/get-paginated-collections.react-query';
import { useUpdateCollectionById } from '#/api/routes/collections/update-collection-by-id/update-collection-by-id.react-query';
import { useSpinner } from '#/components/FullPageLoadingSpinner/useSpinner';
import { PageWrapper } from '#/page-wrapper';
import { Route as CollectionsRoute } from '#/routes/_protected/collections';

import { createOrUpdateCollectionFormOptions } from './CollectionsListPage.form';
import { CollectionsListTable } from './components/CollectionsListTable/CollectionsListTable';
import { useEditingCollectionsRowIds } from './hooks/use-editing-collections-row-ids';

export const CollectionsListPage: RouteComponent = () => {
  const searchQueries = CollectionsRoute.useSearch();

  const { data } = useGetPaginatedCollections({
    placeholderData: {
      collections: [],
      pagination: getPaginationMetadataDefaults(1000),
    },
    requestArgs: { params: searchQueries },
  });

  const { onInterceptRequest } = useSpinner();

  const invalidateGetPaginatedCollections =
    useInvalidateGetPaginatedCollections();

  const invalidateGetCollectionDetailsById =
    useInvalidateGetCollectionDetailsById();

  const invalidateGetNavMenuCollections = useInvalidateGetNavMenuCollections();

  const { onCreateCollection } = useCreateCollection();

  const { onUpdateCollectionById } = useUpdateCollectionById();

  const { isEditing, resetEditingRowIds } = useEditingCollectionsRowIds();

  const form = useForm({
    ...createOrUpdateCollectionFormOptions,
    defaultValues: { records: data.collections },
    onSubmit: async ({ value: { records } }) => {
      await onInterceptRequest(async () => {
        const editedRecords = records.filter(({ isEditing }) => {
          return isEditing;
        });

        const isUpdatedRecords = editedRecords.some(({ createdAt }) => {
          return createdAt;
        });

        if (isUpdatedRecords) {
          await onUpdateCollectionById(
            editedRecords as UpdateCollectionsFormRecordSchemaDef[],
          );

          await Promise.all(
            editedRecords.map(({ id }) => {
              return invalidateGetCollectionDetailsById({ id });
            }),
          );
        } else {
          const newRecords = editedRecords.map((record) => {
            const {
              createdAt: _createdAt,
              id: _id,
              isEditing: _isEditing,
              updatedAt: _updatedAt,
              ...newCollectionData
            } = record;

            return newCollectionData;
          });
          await onCreateCollection({ records: newRecords });
        }

        resetEditingRowIds();

        await invalidateGetNavMenuCollections();
        await invalidateGetPaginatedCollections();

        form.reset();
      });
    },
  });

  useBlocker({
    disabled: !isEditing,
    shouldBlockFn: () => {
      if (isEditing) {
        const shouldLeave = confirm(
          'You will lose any unsaved changes. Are you sure you want to leave?',
        );

        return !shouldLeave;
      } else {
        return false;
      }
    },
  });

  useEffect(() => {
    return () => {
      resetEditingRowIds();
    };
  }, []);

  return (
    <PageWrapper title={`Collections (${data.pagination.totalRecords})`}>
      <CollectionsListTable form={form} />
    </PageWrapper>
  );
};
