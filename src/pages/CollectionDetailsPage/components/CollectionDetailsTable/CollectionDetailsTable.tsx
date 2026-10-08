import { useSelector } from '@tanstack/react-store';
import { useEffect, useMemo } from 'react';

import { getPaginationMetadataDefaults } from '#/api/pagination/pagination.constants';
import {
  useGetCollectionDetailsById,
  useInvalidateGetCollectionDetailsById,
} from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.react-query';
import { Table } from '#/components/Table';
import { Route as CollectionRoute } from '#/routes/_protected/collections/$id';

import type { CreateOrUpdateCollectionItemFormTypeDef } from '../../CollectionDetailsPage.types';

import { useEditingCollectionItemsRowIds } from '../../../CollectionsListPage/hooks/use-editing-collections-row-ids';
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

  const invalidateGetCollectionDetailsById =
    useInvalidateGetCollectionDetailsById();

  const { collection, pagination } = data;

  const onCancel = async () => {
    resetEditingRowIds();

    form.reset();

    await invalidateGetCollectionDetailsById();

    // TODO - CONSIDER ADDING CALL TO ENDPOINT THAT CHECKS FOR ANY CUSTOM FIELDS UNDER USER WITH VALUES THAT DO NOT HAVE LINKS AND DELETE THEM
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

  const filtersProps = useCollectionDetailsFiltersProps();
  const searchProps = useCollectionDetailsSearchProps();
  const paginationProps = useCollectionDetailsPaginationProps({ pagination });
  const sortProps = useCollectionDetailsSortProps();

  const tableData = useSelector(form.atom, ({ values }) => {
    return values.collectionItems;
  });

  useEffect(() => {
    // ? clear edit state on unmount
    return resetEditingRowIds;
  }, []);

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
      data={tableData}
      disableRowSelection={isEditing}
      enableRowSelection
      filters={{
        ...filtersProps,
        FiltersContent: () => {
          return (
            <CollectionDetailsFiltersContent
              collection={collection}
              customFields={data.customFields}
            />
          );
        },
      }}
      pagination={paginationProps}
      search={searchProps}
      sort={sortProps}
    />
  );
};
