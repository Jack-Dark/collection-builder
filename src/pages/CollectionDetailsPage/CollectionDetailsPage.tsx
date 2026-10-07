import type { RouteComponent } from '@tanstack/react-router';

import { useForm } from '@tanstack/react-form';
import { useBlocker } from '@tanstack/react-router';
import { useEffect } from 'react';

import type { OnCreateCollectionItemsArgsDef } from '#/api/routes/collection-items/create-collection-item/create-collection-item.types';
import type { OnUpdateCollectionItemsArgsDef } from '#/api/routes/collection-items/update-collection-item-by-id/update-collection-item-by-id.types';

import { useCreateCollectionItems } from '#/api/routes/collection-items/create-collection-item/create-collection-item.react-query';
import {
  useGetCollectionDetailsById,
  useInvalidateGetCollectionDetailsById,
} from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.react-query';
import { useUpdateCollectionItems } from '#/api/routes/collection-items/update-collection-item-by-id/update-collection-item-by-id.react-query';
import { useSpinner } from '#/components/FullPageLoadingSpinner/useSpinner';
import { PageWrapper } from '#/page-wrapper';
import { Route as CollectionRoute } from '#/routes/_protected/collections/$id';

import { useEditingCollectionItemsRowIds } from '../CollectionsListPage/hooks/use-editing-collections-row-ids';
import { createOrUpdateCollectionItemsFormOptions } from './CollectionDetailsPage.form';
import { CollectionDetailsTable } from './components/CollectionDetailsTable';

export const CollectionDetailsPage: RouteComponent = () => {
  const { id } = CollectionRoute.useParams();
  const searchQueries = CollectionRoute.useSearch();

  const collectionId = Number(id);

  const { onInterceptRequest } = useSpinner();

  const invalidateGetCollectionDetailsById =
    useInvalidateGetCollectionDetailsById();

  const { onCreateCollectionItem } = useCreateCollectionItems({
    showLoading: true,
  });

  const { onUpdateCollectionItems } = useUpdateCollectionItems({
    showLoading: true,
  });

  const { data } = useGetCollectionDetailsById({
    placeholderData: {
      collection: {
        name: '-',
      },
      items: [],
      pagination: {
        totalRecords: 0,
      },
    },
    requestArgs: { collectionId, params: searchQueries },
  });

  const { isEditing, resetEditingRowIds } = useEditingCollectionItemsRowIds();

  const form = useForm({
    ...createOrUpdateCollectionItemsFormOptions,
    defaultValues: { collectionItems: data.items },
    onSubmit: async ({ value: { collectionItems } }) => {
      onInterceptRequest(async () => {
        const editedRecords = collectionItems.filter(({ isEditing }) => {
          return isEditing;
        });

        const isNewRecords = editedRecords.some(({ id }) => {
          return typeof id === 'string';
        });

        if (isNewRecords) {
          const newRecords = editedRecords.map((record) => {
            const {
              createdAt: _createdAt,
              id: _id,
              isEditing: _isEditing,
              updatedAt: _updatedAt,
              userId: _userId,
              ...cleanCollectionItem
            } = record;

            return cleanCollectionItem;
          });

          await onCreateCollectionItem(
            newRecords as OnCreateCollectionItemsArgsDef[],
          );
        } else {
          await onUpdateCollectionItems(
            editedRecords as OnUpdateCollectionItemsArgsDef[],
          );
        }

        resetEditingRowIds();
        await invalidateGetCollectionDetailsById({ id: collectionId });
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
    <PageWrapper
      title={`${data?.collection?.name || '-'} (${data?.pagination.totalRecords})`}
    >
      <CollectionDetailsTable form={form} />
    </PageWrapper>
  );
};
