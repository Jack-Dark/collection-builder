import type { RouteComponent } from '@tanstack/react-router';

import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useCreateCollectionItem } from '#/api/routes/collection-items/create-collection-item/create-collection-item.react-query';
import {
  useGetCollectionDetailsById,
  useInvalidateGetCollectionDetailsById,
} from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.react-query';
import { useUpdateCollectionItemById } from '#/api/routes/collection-items/update-collection-item-by-id/update-collection-item-by-id.react-query';
import { Button } from '#/components/Button';
import { Table, tableCellClasses } from '#/components/Table';
import { PageWrapper } from '#/page-wrapper';
import { Route as CollectionRoute } from '#/routes/_protected/collections/$id';

import { useEditingCollectionItemsRowIds } from '../CollectionsListPage/hooks/use-editing-collections-row-ids';
import { addOrUpdateCollectionItemFormSchema } from './addOrUpdateCollectionItemForm.schema';
import { getCollectionItemsTableColumns } from './columns';
import { AddCollectionItemFormTableRow } from './components/AddCollectionItemForm';
import { useAddCollectionItemForm } from './components/AddCollectionItemForm/add-or-update-collection-item-form.schema';
import {
  CollectionItemsFiltersContent,
  useSetCollectionItemsFiltersFromQueries,
} from './components/CollectionItemsFiltersContent';
import { useCollectionItemsFilters } from './hooks/use-collection-items-filters';
import { useCollectionItemsFormStore } from './hooks/use-collection-items-form-store';
import { useCollectionItemsPagination } from './hooks/use-collection-items-pagination';
import { useCollectionItemsSearch } from './hooks/use-collection-items-search';
import { useCollectionItemsSort } from './hooks/use-collection-items-sort';

export const CollectionItemsPage: RouteComponent = () => {
  const { id } = CollectionRoute.useParams();
  const collectionId = Number(id);
  const search = CollectionRoute.useSearch();

  const { data } = useGetCollectionDetailsById({
    requestArgs: { collectionId, params: search },
  });

  const { collection, customFields, items, lastAddedItem, pagination } = data;

  const { formValues, resetFormValues, updateDefaultValues } =
    useCollectionItemsFormStore();

  const invalidateGetCollectionDetailsById =
    useInvalidateGetCollectionDetailsById();

  const onFormSubmitSuccess = async () => {
    await invalidateGetCollectionDetailsById({ id: collection.id });

    resetEditingRowIds();
    form.reset();
  };

  const { onCreateCollectionItem } = useCreateCollectionItem({
    onSuccess: onFormSubmitSuccess,
  });

  const { onUpdateCollectionItemById } = useUpdateCollectionItemById({
    onSuccess: onFormSubmitSuccess,
  });

  const { addToEditingRowIds, isEditing, resetEditingRowIds } =
    useEditingCollectionItemsRowIds();

  const form = useAddCollectionItemForm({
    defaultValues: formValues,
    onSubmit: async ({ value }) => {
      if (typeof value.id === 'number') {
        await onUpdateCollectionItemById(value);
      } else {
        await onCreateCollectionItem(value);
      }
    },
    validators: {
      onChange: addOrUpdateCollectionItemFormSchema,
      onDynamic: addOrUpdateCollectionItemFormSchema,
      onMount: addOrUpdateCollectionItemFormSchema,
      onSubmit: addOrUpdateCollectionItemFormSchema,
    },
  });

  const columns = useMemo(() => {
    return getCollectionItemsTableColumns(collection);
  }, [collection.id]);

  const filtersProps = useCollectionItemsFilters();
  const searchProps = useCollectionItemsSearch();
  const paginationProps = useCollectionItemsPagination({ pagination });
  const sortProps = useCollectionItemsSort({ collection });

  useSetCollectionItemsFiltersFromQueries();

  useEffect(() => {
    const newFormValues = {
      collectionId,
      customField1Value: lastAddedItem?.customField1Value || '',
      customField2Value: lastAddedItem?.customField2Value || '',
      customField3Value: lastAddedItem?.customField3Value || '',
    };
    updateDefaultValues(newFormValues);
    resetFormValues();
  }, [lastAddedItem]);

  useEffect(() => {
    form.reset();
  }, [isEditing]);

  return (
    <PageWrapper
      childrenClassName="grid gap-4"
      title={
        collection?.name
          ? `${collection.name} (${pagination.totalRecords})`
          : '-'
      }
    >
      {!isEditing && (
        <div className="flex justify-end">
          <Button
            Icon={ControlPointIcon}
            onClick={() => {
              addToEditingRowIds(uuidv4());
            }}
            text="Add New"
            variant="secondary"
          />
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Table
          BodyTopRow={
            isEditing
              ? ({ tdClassNames: _tdClassNames, ...rest }) => {
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
                        resetFormValues();
                        form.reset();
                      }}
                      tdClassNames={tableCellClasses}
                      {...rest}
                    />
                  );
                }
              : undefined
          }
          columns={columns}
          data={items || []}
          filters={{
            FiltersContent: () => {
              return (
                <CollectionItemsFiltersContent
                  collection={collection}
                  customFields={customFields}
                />
              );
            },
            ...filtersProps,
          }}
          pagination={paginationProps}
          search={searchProps}
          sort={sortProps}
        />
      </form>
    </PageWrapper>
  );
};
