import { useSelector } from '@tanstack/react-form';
import { useMemo } from 'react';

import { getPaginationMetadataDefaults } from '#/api/pagination/pagination.constants';
import { useGetPaginatedCollections } from '#/api/routes/collections/get-paginated-collections/get-paginated-collections.react-query';
import { Table } from '#/components/Table';
import { Route as CollectionsRoute } from '#/routes/_protected/collections';

import type { CreateOrUpdateCollectionFormTypeDef } from '../../CollectionsListPage.types';

import { useEditingCollectionsRowIds } from '../../hooks/use-editing-collections-row-ids';
import { getCollectionsListTableColumns } from './CollectionsListTable.columns';
import { CollectionsListTableRowActions } from './components/CollectionsListTableRowActions';
import { useCollectionsListPaginationProps } from './hooks/use-collections-list-pagination-props';
import { useCollectionsListSearchProps } from './hooks/use-collections-list-search-props';
import { useCollectionsListSortProps } from './hooks/use-collections-list-sort-props';

export const CollectionsListTable = ({
  form,
}: {
  form: CreateOrUpdateCollectionFormTypeDef;
}) => {
  const searchQueries = CollectionsRoute.useSearch();

  const { data } = useGetPaginatedCollections({
    placeholderData: {
      collections: [],
      pagination: getPaginationMetadataDefaults(1000),
    },
    requestArgs: { params: searchQueries },
  });

  const { collections, pagination } = data;

  const onCancel = () => {
    resetEditingRowIds();

    form.setFieldValue('records', collections);
  };

  const { addToEditingRowIds, editingRowIds, isEditing, resetEditingRowIds } =
    useEditingCollectionsRowIds();

  const onEditClick = (...rowIdsToAdd: string[]) => {
    addToEditingRowIds(...rowIdsToAdd);

    const recordsWithEditStatus = form.state.values.records.map((rowRecord) => {
      const isEditing = rowIdsToAdd.includes(String(rowRecord.id));

      return { ...rowRecord, isEditing };
    });

    form.setFieldValue('records', recordsWithEditStatus);
  };

  const columns = useMemo(() => {
    return getCollectionsListTableColumns({
      form,
      onCancel,
      onEditClick,
    });
  }, [editingRowIds]);

  const searchProps = useCollectionsListSearchProps();
  const paginationProps = useCollectionsListPaginationProps({ pagination });
  const sortProps = useCollectionsListSortProps();

  const records = useSelector(form.atom, ({ values }) => {
    return values.records;
  });

  return (
    <Table
      AboveTableComponent={({ table }) => {
        const selectedRowIds = table
          .getSelectedRowModel()
          .rows.map(({ id }) => {
            return id;
          });

        return (
          <CollectionsListTableRowActions
            form={form}
            onCancel={onCancel}
            resetRowSelection={table.resetRowSelection}
            selectedRowIds={selectedRowIds}
          />
        );
      }}
      columns={columns}
      // @ts-expect-error // TS type mismatch between new and old records
      data={records}
      disableRowSelection={isEditing}
      enableRowSelection
      pagination={paginationProps}
      search={searchProps}
      sort={sortProps}
    />
  );
};
