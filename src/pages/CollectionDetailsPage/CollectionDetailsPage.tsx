import type { RouteComponent } from '@tanstack/react-router';

import { useForm } from '@tanstack/react-form';
import { useLayoutEffect } from 'react';

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
import {
  createOrUpdateCollectionItemsFormDefaultValues,
  createOrUpdateCollectionItemsFormOptions,
} from './CollectionDetailsPage.form';
import { CollectionDetailsTable } from './components/CollectionDetailsTable';
import { useCollectionDetailsCustomFieldsStore } from './components/CollectionDetailsTable/hooks/use-collection-details-custom-fields-store';
import { useCollectionDetailsFiltersStore } from './components/CollectionDetailsTable/hooks/use-collection-details-filters-store';

export const CollectionDetailsPage: RouteComponent = () => {
  const { id } = CollectionRoute.useParams();
  const searchQueries = CollectionRoute.useSearch();

  const { setAllFilters: setFilters } = useCollectionDetailsFiltersStore();

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
    onSuccess: ({ customFields, items }) => {
      form.setFieldValue('collectionItems', items);
      setCustomFields(customFields);
    },
    requestArgs: { collectionId, params: searchQueries },
  });
  const { setCustomFields } = useCollectionDetailsCustomFieldsStore();

  const { resetEditingRowIds } = useEditingCollectionItemsRowIds();

  const form = useForm({
    ...createOrUpdateCollectionItemsFormOptions,
    defaultValues: data?.items
      ? {
          collectionItems: data.items.map((item) => {
            return { ...item, isEditing: false };
          }),
        }
      : createOrUpdateCollectionItemsFormDefaultValues,
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

  useLayoutEffect(() => {
    if (searchQueries.filters) {
      setFilters(searchQueries.filters);
    }
  }, [searchQueries.filters]);

  return (
    <PageWrapper
      title={`${data?.collection?.name || '-'} (${data?.pagination.totalRecords})`}
    >
      <CollectionDetailsTable form={form} />
    </PageWrapper>
  );
};
