import type { RouteComponent } from '@tanstack/react-router';

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
import { useSelectedTableRowsStore } from '#/components/Table';
import { PageWrapper } from '#/page-wrapper';
import { Route as CollectionRoute } from '#/routes/_protected/collections/$id';

import { useEditingCollectionItemsRowIds } from '../CollectionsListPage/hooks/use-editing-collections-row-ids';
import {
  collectionDetailsFormDefaultValues,
  useCollectionDetailsForm,
} from './CollectionDetailsPage.form';
import { createOrUpdateCollectionItemFormSchema } from './CollectionDetailsPage.schema';
import { CollectionDetailsTable } from './components/CollectionDetailsTable';
import { useCollectionDetailsCustomFieldsStore } from './components/CollectionDetailsTable/hooks/use-collection-details-custom-fields-store';
import { useCollectionDetailsFiltersStore } from './components/CollectionDetailsTable/hooks/use-collection-details-filters-store';

export const CollectionDetailsPage: RouteComponent = () => {
  const { id } = CollectionRoute.useParams();
  const searchQueries = CollectionRoute.useSearch();

  const { setAllFilters: setFilters } = useCollectionDetailsFiltersStore();

  const collectionId = Number(id);

  const { onInterceptProcessingRequest, processing, toggleSpinner } =
    useSpinner();

  const invalidateGetCollectionDetailsById =
    useInvalidateGetCollectionDetailsById();

  const { onCreateCollectionItem } = useCreateCollectionItems();

  const { onUpdateCollectionItems } = useUpdateCollectionItems();

  const { data } = useGetCollectionDetailsById({
    onSuccess: ({ customFields, items }) => {
      form.setFieldValue('collectionItems', items);
      setCustomFields(customFields);
    },
    requestArgs: { collectionId, params: searchQueries },
  });
  const { setCustomFields } = useCollectionDetailsCustomFieldsStore();

  const { resetEditingRowIds } = useEditingCollectionItemsRowIds();

  const { resetSelectedTableRows } = useSelectedTableRowsStore();

  const form = useCollectionDetailsForm({
    defaultValues: data?.items
      ? {
          collectionItems: data.items.map((item) => {
            return { ...item, isEditing: false };
          }),
        }
      : collectionDetailsFormDefaultValues,
    onSubmit: async ({ value: { collectionItems } }) => {
      onInterceptProcessingRequest(async () => {
        const editedRecords = collectionItems.filter(({ isEditing }) => {
          return isEditing;
        });

        const isUpdatedRecords = editedRecords.some(({ createdAt }) => {
          return createdAt;
        });

        if (isUpdatedRecords) {
          await onUpdateCollectionItems(
            editedRecords as OnUpdateCollectionItemsArgsDef[],
          );
        } else {
          const newRecords = editedRecords.map((record) => {
            const {
              createdAt: _createdAt,
              id,
              isEditing: _isEditing,
              updatedAt: _updatedAt,
              userId: _userId,
              ...newCollectionItemData
            } = record;

            return { ...newCollectionItemData, id: String(id) };
          });
          await onCreateCollectionItem(
            newRecords as OnCreateCollectionItemsArgsDef[],
          );
        }

        resetEditingRowIds();
        resetSelectedTableRows();
        await invalidateGetCollectionDetailsById({ id: collectionId });
      });
    },
    validators: {
      onChange: createOrUpdateCollectionItemFormSchema,
      onSubmit: createOrUpdateCollectionItemFormSchema,
    },
  });

  useEffect(() => {
    toggleSpinner(processing);
  }, [processing]);

  useEffect(() => {
    if (searchQueries.filters) {
      setFilters(searchQueries.filters);
    }
  }, [searchQueries.filters]);

  return (
    <PageWrapper
      title={`${data?.collection.name} (${data?.pagination.totalRecords})`}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <CollectionDetailsTable form={form} />
      </form>
    </PageWrapper>
  );
};
