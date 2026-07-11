import type { RouteComponent } from '@tanstack/react-router';

import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { revalidateLogic } from '@tanstack/react-form';
import { useRouter } from '@tanstack/react-router';
import { create } from 'zustand';

import { useCreateCollection } from '#/api/routes/collections/create-collection/create-collection.react-query';
import { useUpdateCollectionById } from '#/api/routes/collections/update-collection-by-id/update-collection-by-id.react-query';
import { Button } from '#/components/Button';
import { Table, tableCellClasses } from '#/components/Table';
import { PageWrapper } from '#/page-wrapper';
import { collectionFormSchema } from '#/pages/CollectionsListPage/collection-form.schema';
import { Route } from '#/routes/_protected/collections';

import type { AddCollectionFormSchemaDef } from './components/AddCollectionFormTableRow/types';

import { getCollectionsListTableColumns } from './columns';
import { AddCollectionFormTableRow } from './components/AddCollectionFormTableRow';
import {
  addCollectionFormDefaultValues,
  useAddCollectionForm,
} from './components/AddCollectionFormTableRow/constants';
import { useEditingCollectionsRowIds } from './hooks/use-editing-collections-row-ids';

export const useCollectionsListFormStore = create<{
  collectionFormValues: AddCollectionFormSchemaDef;
  resetCollectionFormValues: () => void;
  setCollectionFormValues: (values: AddCollectionFormSchemaDef) => void;
}>((set) => {
  return {
    collectionFormValues: addCollectionFormDefaultValues,
    resetCollectionFormValues: () => {
      set({
        collectionFormValues: addCollectionFormDefaultValues,
      });
    },
    setCollectionFormValues: (values) => {
      set({
        collectionFormValues: values,
      });
    },
  };
});

export const CollectionsListPage: RouteComponent = () => {
  const { collections, pagination } = Route.useLoaderData();

  const router = useRouter();

  const { collectionFormValues, resetCollectionFormValues } =
    useCollectionsListFormStore();

  const { onCreateCollection } = useCreateCollection({
    onSuccess: () => {
      resetCollectionFormValues();
    },
  });

  const { onUpdateCollection } = useUpdateCollectionById({
    onSuccess: () => {
      resetCollectionFormValues();
    },
  });

  const form = useAddCollectionForm({
    defaultValues: collectionFormValues,
    onSubmit: async ({ value }) => {
      if (value.id) {
        await onUpdateCollection({
          data: value,
        });

        resetEditingRowIds();
      } else {
        await onCreateCollection({
          data: {
            // undefined values added long-hand to resolve type errors
            ...value,
            createdAt: undefined,
            id: undefined,
            userId: undefined,
          },
        });
      }

      form.reset();

      await router.invalidate();
    },
    validationLogic: revalidateLogic({
      mode: 'submit',
      modeAfterSubmission: 'change',
    }),
    validators: {
      onSubmit: collectionFormSchema,
    },
  });

  const { addToEditingRowIds, isEditing, resetEditingRowIds } =
    useEditingCollectionsRowIds();

  const columns = getCollectionsListTableColumns();

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
          e.stopPropagation();
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
                        resetCollectionFormValues();
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
              onChange: (limit) => {},
              value: pagination.pageSize,
            },
            page: {
              max: pagination.totalPages,
              onChange: (page) => {},
              value: pagination.currentPage,
            },
          }}
        />
      </form>
    </PageWrapper>
  );
};
