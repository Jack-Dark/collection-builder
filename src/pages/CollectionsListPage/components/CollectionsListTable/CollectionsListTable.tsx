import { useMemo } from 'react';

import { useGetPaginatedCollections } from '#/api/routes/collections/get-paginated-collections/get-paginated-collections.react-query';
import { Table } from '#/components/Table';
import { Route as CollectionsRoute } from '#/routes/_protected/collections';

import {
  collectionsListFormDefaultValues,
  withCollectionsListForm,
} from '../../CollectionsListPage.form';
import { useEditingCollectionsRowIds } from '../../hooks/use-editing-collections-row-ids';
import { getCollectionsListTableColumns } from './CollectionsListTable.columns';
import { CollectionsListTableRowActions } from './components/CollectionsListTableRowActions';
import { useCollectionsListPaginationProps } from './hooks/use-collections-list-pagination-props';
import { useCollectionsListSearchProps } from './hooks/use-collections-list-search-props';
import { useCollectionsListSortProps } from './hooks/use-collections-list-sort-props';

export const CollectionsListTable = withCollectionsListForm({
  /** These values are only used for type-checking, and are not used at runtime */
  defaultValues: collectionsListFormDefaultValues,
  render: ({ form }) => {
    const searchQueries = CollectionsRoute.useSearch();

    const { data } = useGetPaginatedCollections({
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

      const selectedRowsInEditMode = form.state.values.records.map(
        (rowRecord) => {
          const isEditing = rowIdsToAdd.includes(String(rowRecord.id));

          return { ...rowRecord, isEditing };
        },
      );

      form.setFieldValue('records', selectedRowsInEditMode);
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

    return (
      <form.AppField mode="array" name="records">
        {(recordsField) => {
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
              data={recordsField.state.value}
              disableRowSelection={isEditing}
              enableRowSelection
              pagination={paginationProps}
              search={searchProps}
              sort={sortProps}
            />
          );
        }}
      </form.AppField>
    );
  },
});
