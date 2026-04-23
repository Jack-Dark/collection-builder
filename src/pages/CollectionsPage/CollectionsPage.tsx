import type { RouteComponent } from '@tanstack/react-router';

import { create } from 'zustand';

import { Table } from '#/components/Table';
import { PageWrapper } from '#/page-wrapper';
import { Route } from '#/routes/_protected/collections';

import { collectionTableColumns } from './columns';
import { AddCollectionForm } from './components/AddCollectionForm';

const defaultValues = {
  isEditingRowId: '',
};
const useAddOrEditCollection = create<{
  isEditingRowId: string;
  resetIsEditingRowId: () => void;
  setIsEditingRowId: (value: string) => void;
}>((set) => {
  return {
    isEditingRowId: defaultValues.isEditingRowId,
    resetIsEditingRowId: () => {
      set({
        isEditingRowId: defaultValues.isEditingRowId,
      });
    },
    setIsEditingRowId: (value) => {
      set({
        isEditingRowId: value,
      });
    },
  };
});

export const CollectionsPage: RouteComponent = () => {
  const collections = Route.useLoaderData();

  return (
    <PageWrapper title="Collections">
      <div className="grid grid-cols-1 gap-4">
        <h3>Add Collection</h3>
        <AddCollectionForm />
      </div>
      <Table columns={collectionTableColumns} data={collections.data} />
    </PageWrapper>
  );
};
