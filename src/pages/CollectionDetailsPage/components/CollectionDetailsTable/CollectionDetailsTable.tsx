import { useMemo } from 'react';

import { useGetCollectionDetailsById } from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.react-query';
import { Table, useSelectedTableRowsStore } from '#/components/Table';
import { Route as CollectionRoute } from '#/routes/_protected/collections/$id';

import { useEditingCollectionItemsRowIds } from '../../../CollectionsListPage/hooks/use-editing-collections-row-ids';
import { useCollectionItemsFiltersProps } from '../../hooks/use-collection-items-filters-props';
import { useCollectionItemsPagination } from '../../hooks/use-collection-items-pagination';
import { useCollectionItemsSearch } from '../../hooks/use-collection-items-search';
import { useCollectionItemsSort } from '../../hooks/use-collection-items-sort';
import { useTableCustomFieldsStore } from '../../hooks/use-table-custom-fields-store';
import {
  addCollectionItemFormDefaultValues,
  withCollectionDetailsForm,
} from '../CreateOrUpdateCollectionItemForm/CreateOrUpdateCollectionItemForm.form';
import { getCollectionItemsTableColumns } from './CollectionDetailsTable.columns';
import { CollectionDetailsTableActions } from './components/CollectionDetailsTableActions';
import { CollectionDetailsFiltersContent } from './components/CollectionItemsFiltersContent';

export const CollectionDetailsTable = withCollectionDetailsForm({
  /** These values are only used for type-checking, and are not used at runtime */
  defaultValues: addCollectionItemFormDefaultValues,
  render: ({ form }) => {
    const { id } = CollectionRoute.useParams();
    const collectionId = Number(id);
    const search = CollectionRoute.useSearch();

    const { customFields, setCustomFields } = useTableCustomFieldsStore();

    const { data } = useGetCollectionDetailsById({
      onSuccess: ({ customFields, items }) => {
        form.setFieldValue('collectionItems', items);
        resetEditingRowIds();
        resetSelectedTableRows();
        setCustomFields(customFields);
      },
      requestArgs: { collectionId, params: search },
    });

    const { collection, pagination } = data;

    const onCancel = () => {
      resetEditingRowIds();

      form.setFieldValue('collectionItems', data.items);
    };
    const { addToEditingRowIds, editingRowIds, resetEditingRowIds } =
      useEditingCollectionItemsRowIds();

    const { getSelectedRowIds, resetSelectedTableRows, selectedTableRows } =
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

    const filtersProps = useCollectionItemsFiltersProps();
    const searchProps = useCollectionItemsSearch();
    const paginationProps = useCollectionItemsPagination({ pagination });
    const sortProps = useCollectionItemsSort({ collection });

    return (
      <form.AppField mode="array" name="collectionItems">
        {(collectionItemsField) => {
          return (
            <Table
              AboveTableComponent={() => {
                return (
                  <CollectionDetailsTableActions
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
