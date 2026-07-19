import type { NavigateOptions, RouteComponent } from '@tanstack/react-router';

import ClearIcon from '@mui/icons-material/Clear';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { revalidateLogic } from '@tanstack/react-form';
import { useRouterState } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';

import type { CollectionTableColumnsDef } from '#/api/routes/collections/collection.types';
import type { SortItemDef } from '#/components/Table';

import { sortDirectionOptions } from '#/api/pagination/pagination.constants';
import { useCreateCollection } from '#/api/routes/collections/create-collection/create-collection.react-query';
import { useGetPaginatedCollections } from '#/api/routes/collections/get-paginated-collections/get-paginated-collections.react-query';
import { useUpdateCollectionById } from '#/api/routes/collections/update-collection-by-id/update-collection-by-id.react-query';
import { Button } from '#/components/Button';
import { useSpinner } from '#/components/FullPageLoadingSpinner/useSpinner';
import { Table } from '#/components/Table';
import { createFormStore } from '#/helpers/create-form-store';
import { PageWrapper } from '#/page-wrapper';
import { createOrUpdateCollectionFormSchema } from '#/pages/CollectionsListPage/collection-form.schema';
import { Route } from '#/routes/_protected/collections';

import type { UnformattedSortItemDef } from '../CollectionItemsPage/components/CollectionItemsFiltersContent';
import type { CreateOrUpdateCollectionFormDataSchemaDef } from './components/AddCollectionFormTableRow/types';

import { formatSortItems } from '../CollectionItemsPage/components/CollectionItemsFiltersContent';
import { getCollectionsListTableColumns } from './columns';
import {
  addCollectionFormDefaultValues,
  tempNewCollectionId,
  useAddCollectionForm,
} from './components/AddCollectionFormTableRow/AddCollectionFormTableRow.form';
import { useEditingCollectionsRowIds } from './hooks/use-editing-collections-row-ids';

export const useCollectionsListFormStore = createFormStore(
  addCollectionFormDefaultValues,
);

// TODO - ADD IN-ROW ADD/EDIT LOGIC LIKE ON COLLECTION ITEMS
export const CollectionsListPage: RouteComponent = () => {
  const [tableData, setTableData] = useState<
    CreateOrUpdateCollectionFormDataSchemaDef[]
  >([]);

  const { isLoading } = useRouterState();
  const { toggleSpinner } = useSpinner();

  const search = Route.useSearch();

  const { data } = useGetPaginatedCollections({
    onSuccess: ({ collections }) => {
      setTableData(collections);
    },
    requestArgs: { params: search },
  });
  const { pagination } = data;

  const { formValues, resetFormValues } = useCollectionsListFormStore();

  const { onCreateCollection } = useCreateCollection({
    onSuccess: async () => {
      resetFormValues();
    },
  });

  const { onUpdateCollectionById } = useUpdateCollectionById({
    onSuccess: async () => {
      resetFormValues();
    },
  });

  const form = useAddCollectionForm({
    defaultValues: formValues,
    onSubmit: async ({ value }) => {
      if (value.createdAt) {
        await onUpdateCollectionById(value);
      } else {
        const {
          createdAt: _createdAt,
          id,
          updatedAt: _updatedAt,
          userId: _userId,
          ...newCollectionData
        } = value;
        await onCreateCollection({
          ...newCollectionData,
          id: String(id),
        });
      }

      resetEditingRowIds();
      form.reset();
    },
    validationLogic: revalidateLogic({
      mode: 'submit',
      modeAfterSubmission: 'change',
    }),
    validators: {
      onSubmit: createOrUpdateCollectionFormSchema,
    },
  });

  const {
    addToEditingRowIds,
    isEditing,
    removeFromIsEditingRowIds,
    resetEditingRowIds,
  } = useEditingCollectionsRowIds();

  const columns = useMemo(() => {
    return getCollectionsListTableColumns();
  }, []);

  const { onUpdateCollectionsQueries } = useOnUpdateCollectionQueries();

  const searchProps = useCollectionSearch();
  const sortProps = useCollectionSort<CollectionTableColumnsDef>({
    items: [
      {
        bidirectional: true,
        field: 'name',
        label: 'Name',
      },
      {
        bidirectional: true,
        field: 'createdAt',
        label: 'Added',
      },
    ],
  });

  useEffect(() => {
    toggleSpinner(isLoading);
  }, [isLoading]);

  return (
    <PageWrapper title="Collections">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="grid gap-4">
          <div className="flex justify-end">
            {isEditing ? (
              <Button
                Icon={ClearIcon}
                onClick={() => {
                  removeFromIsEditingRowIds(tempNewCollectionId);

                  setTableData((prevValues) => {
                    return prevValues.slice(1);
                  });
                }}
                text="Cancel"
                variant="secondary"
              />
            ) : (
              <Button
                Icon={ControlPointIcon}
                onClick={() => {
                  addToEditingRowIds(tempNewCollectionId);

                  setTableData((prevValues) => {
                    const newRecord: CreateOrUpdateCollectionFormDataSchemaDef =
                      addCollectionFormDefaultValues;

                    return [newRecord, ...prevValues];
                  });
                }}
                text="Add New"
                variant="secondary"
              />
            )}
          </div>

          <Table
            columns={columns}
            // @ts-expect-error // TODO - INVESTIGATE TS SOLUTION
            data={tableData}
            pagination={{
              limit: {
                onChange: (limit) => {
                  onUpdateCollectionsQueries({ limit });
                },
                value: search.limit || 100,
              },
              page: {
                max: pagination.totalPages,
                onChange: (page) => {
                  onUpdateCollectionsQueries({ page });
                },
                value: search.page || 1,
              },
            }}
            search={searchProps}
            sort={sortProps}
          />
        </div>
      </form>
    </PageWrapper>
  );
};

export const useOnUpdateCollectionQueries = () => {
  const navigate = Route.useNavigate();
  const searchQueries = Route.useSearch();

  const onUpdateCollectionsQueries = async (
    updatedQueries: Partial<typeof searchQueries>,
    options?: NavigateOptions,
  ) => {
    const { limit, search } = updatedQueries;

    await navigate({
      search: {
        ...searchQueries,
        ...updatedQueries,
        page: limit || search ? 1 : searchQueries.page || 1,
      },
      ...options,
    });
  };

  return { onUpdateCollectionsQueries, searchQueries };
};

export const useCollectionSearch = () => {
  const { onUpdateCollectionsQueries, searchQueries } =
    useOnUpdateCollectionQueries();

  const onChange = async (search: string) => {
    onUpdateCollectionsQueries({ search });
  };

  return {
    onChange,
    value: searchQueries.search,
  };
};

export const useCollectionSort = <
  TField extends CollectionTableColumnsDef,
>(props: {
  items: UnformattedSortItemDef<TField>[];
}) => {
  const { items } = props;

  const { onUpdateCollectionsQueries, searchQueries } =
    useOnUpdateCollectionQueries();

  const formattedItems = useMemo(() => {
    return formatSortItems(items);
  }, [...items]);

  const onChange = (sort: SortItemDef<TField> | null) => {
    onUpdateCollectionsQueries({
      sort: {
        direction: sort?.direction || sortDirectionOptions.asc,
        field: sort?.field || 'name',
      },
    });
  };

  const { direction, field } = searchQueries.sort;
  const defaultValue = formattedItems.find((item) => {
    return item.field === field && item.direction === direction;
  });

  return {
    items: formattedItems,
    onChange,
    value: defaultValue,
  };
};
