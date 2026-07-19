import type { RouteComponent } from '@tanstack/react-router';

import { useRouterState } from '@tanstack/react-router';
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

import {
  collectionDetailsFormDefaultValues,
  useCollectionDetailsForm,
} from './CollectionDetailsPage.form';
import { createOrUpdateCollectionItemFormSchema } from './CollectionDetailsPage.schema';
import { CollectionDetailsTable } from './components/CollectionDetailsTable';
import { useSetCollectionItemsFiltersFromQueries } from './hooks/use-set-collection-items-filters-from-queries';

export const CollectionDetailsPage: RouteComponent = () => {
  const { id } = CollectionRoute.useParams();
  const searchParams = CollectionRoute.useSearch();
  const collectionId = Number(id);

  const { isLoading } = useRouterState();
  const { toggleSpinner } = useSpinner();

  useSetCollectionItemsFiltersFromQueries();

  const invalidateGetCollectionDetailsById =
    useInvalidateGetCollectionDetailsById();

  const onFormSubmitSuccess = async () => {
    await invalidateGetCollectionDetailsById({ id: collectionId });
  };

  const { onCreateCollectionItem } = useCreateCollectionItems({
    onSuccess: onFormSubmitSuccess,
  });

  const { onUpdateCollectionItems: onUpdateCollectionItemById } =
    useUpdateCollectionItems({
      onSuccess: onFormSubmitSuccess,
    });

  const { data } = useGetCollectionDetailsById({
    requestArgs: { collectionId, params: searchParams },
  });

  const form = useCollectionDetailsForm({
    defaultValues: data?.items
      ? {
          collectionItems: data.items.map((item) => {
            return { ...item, isEditing: false };
          }),
        }
      : collectionDetailsFormDefaultValues,
    onSubmit: async ({ value: { collectionItems } }) => {
      const editedRecords = collectionItems.filter(({ isEditing }) => {
        return isEditing;
      });

      const isUpdatedRecords = editedRecords.some(({ createdAt }) => {
        return createdAt;
      });

      if (isUpdatedRecords) {
        await onUpdateCollectionItemById(
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
    },
    validators: {
      onChange: createOrUpdateCollectionItemFormSchema,
      onSubmit: createOrUpdateCollectionItemFormSchema,
    },
  });

  useEffect(() => {
    toggleSpinner(isLoading);
  }, [isLoading]);

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
