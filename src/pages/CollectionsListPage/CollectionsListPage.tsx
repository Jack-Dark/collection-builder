import type { NavigateOptions, RouteComponent } from '@tanstack/react-router';

import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { revalidateLogic } from '@tanstack/react-form';
import _ from 'lodash';
import { useMemo } from 'react';

import type { CollectionTableColumnsDef } from '#/api/routes/collections/collection.types';
import type { SortItemDef } from '#/components/Table';

import { sortDirectionOptions } from '#/api/pagination/pagination.constants';
import { useCreateCollection } from '#/api/routes/collections/create-collection/create-collection.react-query';
import { useGetPaginatedCollections } from '#/api/routes/collections/get-paginated-collections/get-paginated-collections.react-query';
import { useUpdateCollectionById } from '#/api/routes/collections/update-collection-by-id/update-collection-by-id.react-query';
import { Button } from '#/components/Button';
import { Table, tableCellClasses } from '#/components/Table';
import { createFormStore } from '#/helpers/create-form-store';
import { PageWrapper } from '#/page-wrapper';
import { createOrUpdateCollectionFormSchema } from '#/pages/CollectionsListPage/collection-form.schema';
import { Route } from '#/routes/_protected/collections';

import type { UnformattedSortItemDef } from '../CollectionItemsPage/components/CollectionItemsFiltersContent';

import { formatSortItems } from '../CollectionItemsPage/components/CollectionItemsFiltersContent';
import { getCollectionsListTableColumns } from './columns';
import { AddCollectionFormTableRow } from './components/AddCollectionFormTableRow';
import {
  addCollectionFormDefaultValues,
  useAddCollectionForm,
} from './components/AddCollectionFormTableRow/constants';
import { useEditingCollectionsRowIds } from './hooks/use-editing-collections-row-ids';

export const useCollectionsListFormStore = createFormStore(
  addCollectionFormDefaultValues,
);

export const CollectionsListPage: RouteComponent = () => {
  const search = Route.useSearch();

  const { data } = useGetPaginatedCollections({
    requestArgs: { params: search },
  });
  const { collections, pagination } = data;

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
      if (typeof value.id === 'number') {
        await onUpdateCollectionById(value);
      } else {
        await onCreateCollection(value);
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

  const { addToEditingRowIds, isEditing, resetEditingRowIds } =
    useEditingCollectionsRowIds();

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

  return (
    <PageWrapper title="Collections">
      <div className="grid gap-4">
        {!isEditing && (
          <div className="flex justify-end">
            <Button
              Icon={ControlPointIcon}
              onClick={() => {
                addToEditingRowIds('');
              }}
              text="Add New"
              variant="secondary"
            />
          </div>
        )}
      </div>
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
                    <AddCollectionFormTableRow
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
          data={collections}
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

  const onChange = _.debounce(async (searchValue: string) => {
    const search = searchValue.trim();

    onUpdateCollectionsQueries({ search });
  }, 200);

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
