import { useEffect, useMemo } from 'react';

import { getPaginationMetadataDefaults } from '#/api/pagination/pagination.constants';
import { useGetCollectionDetailsById } from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.react-query';
import { useDeleteUnusedCustomFieldValues } from '#/api/routes/custom-field-values/delete-unused-custom-field-values/delete-unused-custom-field-values.react-query';
import { Table } from '#/components/Table';
import { Route as CollectionRoute } from '#/routes/_protected/collections/$id';

import type { CreateOrUpdateCollectionItemFormTypeDef } from '../../CollectionDetailsPage.types';

import { useEditingCollectionItemsRowIds } from '../../hooks/use-editing-collection-items-row-ids';
import { getCollectionItemsTableColumns } from './CollectionDetailsTable.columns';
import { CollectionDetailsTableRowActions } from './components/CollectionDetailsTableRowActions';
import { CollectionDetailsFiltersContent } from './components/CollectionItemsFiltersContent';
import { useCollectionDetailsFiltersProps } from './hooks/use-collection-details-filters-props';
import { useCollectionDetailsPaginationProps } from './hooks/use-collection-details-pagination-props';
import { useCollectionDetailsSearchProps } from './hooks/use-collection-details-search-props';
import { useCollectionDetailsSortProps } from './hooks/use-collection-details-sort-props';

export const CollectionDetailsTable = ({
  form,
}: {
  form: CreateOrUpdateCollectionItemFormTypeDef;
}) => {
  const { id } = CollectionRoute.useParams();
  const collectionId = Number(id);
  const search = CollectionRoute.useSearch();

  const { data } = useGetCollectionDetailsById({
    placeholderData: {
      collection: {
        customFields: [],
      },
      pagination: getPaginationMetadataDefaults(),
    },
    requestArgs: { collectionId, params: search },
  });

  const { onDeleteUnusedCustomFieldValues } =
    useDeleteUnusedCustomFieldValues();

  const { pagination } = data;

  const onCancel = async () => {
    resetEditingRowIds();

    form.reset();

    await onDeleteUnusedCustomFieldValues({ collectionId });
  };

  const { addToEditingRowIds, isEditing, resetEditingRowIds } =
    useEditingCollectionItemsRowIds();

  const onEditClick = (...rowIdsToAdd: string[]) => {
    addToEditingRowIds(...rowIdsToAdd);

    const selectedRowsInEditMode = form.state.values.collectionItems.map(
      (rowRecord) => {
        const isEditing = rowIdsToAdd.includes(String(rowRecord.id));

        return { ...rowRecord, isEditing };
      },
    );

    form.setFieldValue('collectionItems', selectedRowsInEditMode);
  };

  const columns = useMemo(() => {
    return getCollectionItemsTableColumns({
      customFields: data?.collection?.customFields || [],
      form,
      onCancel,
      onEditClick,
    });
  }, [data?.collection?.customFields]);

  const { form: filtersForm, ...filtersProps } =
    useCollectionDetailsFiltersProps();
  const searchProps = useCollectionDetailsSearchProps();
  const paginationProps = useCollectionDetailsPaginationProps({ pagination });
  const sortProps = useCollectionDetailsSortProps();

  useEffect(() => {
    // ? clear edit state on unmount
    return resetEditingRowIds;
  }, []);

  return (
    <form.Field name="collectionItems">
      {(field) => {
        return (
          <Table
            AboveTableComponent={({ table }) => {
              const selectedRowIds = table
                .getSelectedRowModel()
                .rows.map(({ id }) => {
                  return id;
                });

              return (
                <CollectionDetailsTableRowActions
                  form={form}
                  onCancel={onCancel}
                  resetRowSelection={table.resetRowSelection}
                  selectedRowIds={selectedRowIds}
                />
              );
            }}
            columns={columns}
            data={field.value}
            disableRowSelection={isEditing}
            filters={{
              ...filtersProps,
              FiltersContent: () => {
                return (
                  <CollectionDetailsFiltersContent
                    collectionId={collectionId}
                    form={filtersForm}
                  />
                );
              },
            }}
            pagination={paginationProps}
            search={searchProps}
            showRowSelection
            sort={sortProps}
          />
        );
      }}
    </form.Field>
  );
};
