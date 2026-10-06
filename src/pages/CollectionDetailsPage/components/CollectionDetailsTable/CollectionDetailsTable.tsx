import { useBlocker } from '@tanstack/react-router';
import { useEffect } from 'react';

import { useGetCollectionDetailsById } from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.react-query';
import { Table } from '#/components/Table';
import { Route as CollectionRoute } from '#/routes/_protected/collections/$id';

import type { CreateOrUpdateCollectionItemFormTypeDef } from '../../CollectionDetailsPage.types';

import { useEditingCollectionItemsRowIds } from '../../../CollectionsListPage/hooks/use-editing-collections-row-ids';
import { useGetCollectionItemsTableColumns } from './CollectionDetailsTable.columns';
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
    requestArgs: { collectionId, params: search },
  });

  const { collection, items, pagination } = data;

  const onCancel = () => {
    resetEditingRowIds();

    form.setFieldValue('collectionItems', items);

    // TODO - ADD CALL TO ENDPOINT THAT CHECKS FOR ANY CUSTOM FIELDS UNDER USER WITH VALUES THAT DO NOT HAVE LINKS AND DELETE THEM
  };
  const { addToEditingRowIds, editingRowIds, isEditing, resetEditingRowIds } =
    useEditingCollectionItemsRowIds();

  useBlocker({
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

  const columns = useGetCollectionItemsTableColumns({
    customField1Enabled: collection?.customField1Enabled,
    customField1Label: collection?.customField1Label,
    customField2Enabled: collection?.customField2Enabled,
    customField2Label: collection?.customField2Label,
    customField3Enabled: collection?.customField3Enabled,
    customField3Label: collection?.customField3Label,
    customFields: data?.collection?.customFields || [],
    form,
    onCancel,
    onEditClick,
  });

  const filtersProps = useCollectionDetailsFiltersProps();
  const searchProps = useCollectionDetailsSearchProps();
  const paginationProps = useCollectionDetailsPaginationProps({ pagination });
  const sortProps = useCollectionDetailsSortProps({ collection });

  useEffect(() => {
    // ? clear edit state on unmount
    return resetEditingRowIds;
  }, []);

  return (
    <form.ArrayField name="collectionItems">
      {(collectionItemsField) => {
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
            // @ts-expect-error // TS type mismatch between new and old records
            data={collectionItemsField.state.value}
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
      }}
    </form.ArrayField>
  );
};
