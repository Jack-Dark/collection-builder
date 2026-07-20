import { useMemo } from 'react';

import { useGetCollectionDetailsById } from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.react-query';
import { Table, useSelectedTableRowsStore } from '#/components/Table';
import { Route as CollectionRoute } from '#/routes/_protected/collections/$id';

import { useEditingCollectionItemsRowIds } from '../../../CollectionsListPage/hooks/use-editing-collections-row-ids';
import {
  collectionDetailsFormDefaultValues,
  withCollectionDetailsForm,
} from '../../CollectionDetailsPage.form';
import { getCollectionItemsTableColumns } from './CollectionDetailsTable.columns';
import { CollectionDetailsTableRowActions } from './components/CollectionDetailsTableRowActions';
import { CollectionDetailsFiltersContent } from './components/CollectionItemsFiltersContent';
import { useCollectionDetailsCustomFieldsStore } from './hooks/use-collection-details-custom-fields-store';
import { useCollectionDetailsFiltersProps } from './hooks/use-collection-details-filters-props';
import { useCollectionDetailsPaginationProps } from './hooks/use-collection-details-pagination-props';
import { useCollectionDetailsSearchProps } from './hooks/use-collection-details-search-props';
import { useCollectionDetailsSortProps } from './hooks/use-collection-details-sort-props';

export const CollectionDetailsTable = withCollectionDetailsForm({
  /** These values are only used for type-checking, and are not used at runtime */
  defaultValues: collectionDetailsFormDefaultValues,
  render: ({ form }) => {
    const { id } = CollectionRoute.useParams();
    const collectionId = Number(id);
    const search = CollectionRoute.useSearch();

    const { customFields } = useCollectionDetailsCustomFieldsStore();

    const { data } = useGetCollectionDetailsById({
      requestArgs: { collectionId, params: search },
    });

    const { collection, items, pagination } = data;

    const onCancel = () => {
      resetEditingRowIds();

      form.setFieldValue('collectionItems', items);
    };
    const { addToEditingRowIds, editingRowIds, resetEditingRowIds } =
      useEditingCollectionItemsRowIds();

    const { getSelectedRowIds, selectedTableRows } =
      useSelectedTableRowsStore();

    const selectedRowIds = useMemo(() => {
      return getSelectedRowIds();
    }, [selectedTableRows]);

    const onEditClick = (rowId?: string) => {
      const rowsToAdd = rowId ? [rowId] : selectedRowIds;
      addToEditingRowIds(...rowsToAdd);

      const selectedRowsInEditMode = form.state.values.collectionItems.map(
        (rowRecord) => {
          const isEditing = rowsToAdd.includes(String(rowRecord.id));

          return { ...rowRecord, isEditing };
        },
      );

      form.setFieldValue('collectionItems', selectedRowsInEditMode);
    };

    const columns = useMemo(() => {
      return getCollectionItemsTableColumns({
        customField1Enabled: collection.customField1Enabled,
        customField1Label: collection.customField1Label,
        customField2Enabled: collection.customField2Enabled,
        customField2Label: collection.customField2Label,
        customField3Enabled: collection.customField3Enabled,
        customField3Label: collection.customField3Label,
        form,
        onCancel,
        onEditClick,
      });
    }, [
      collection.customField1Enabled,
      collection.customField1Label,
      collection.customField2Enabled,
      collection.customField2Label,
      collection.customField3Enabled,
      collection.customField3Label,
      editingRowIds,
      customFields,
      selectedRowIds,
    ]);

    const filtersProps = useCollectionDetailsFiltersProps();
    const searchProps = useCollectionDetailsSearchProps();
    const paginationProps = useCollectionDetailsPaginationProps({ pagination });
    const sortProps = useCollectionDetailsSortProps({ collection });

    return (
      <form.AppField mode="array" name="collectionItems">
        {(collectionItemsField) => {
          return (
            <Table
              AboveTableComponent={() => {
                return (
                  <CollectionDetailsTableRowActions
                    form={form}
                    onCancel={onCancel}
                  />
                );
              }}
              columns={columns}
              // @ts-expect-error // TS type mismatch between new and old records
              data={collectionItemsField.state.value}
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
      </form.AppField>
    );
  },
});
