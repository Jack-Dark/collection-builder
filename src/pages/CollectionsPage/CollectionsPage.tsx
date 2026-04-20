import type { RouteComponent } from '@tanstack/react-router';

import { Table } from '#/components/Table';
import { PageWrapper } from '#/page-wrapper';
import { Route as ProtectedRoute } from '#/routes/_protected/route';

import { collectionTableColumns } from './columns';
import { AddCollectionForm } from './components/AddCollectionForm';

export const CollectionsPage: RouteComponent = () => {
  const { collections } = ProtectedRoute.useRouteContext();

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
