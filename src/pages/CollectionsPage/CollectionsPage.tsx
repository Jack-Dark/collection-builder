import type { RouteComponent } from '@tanstack/react-router';

import { Table } from '#/components/Table';
import { PageWrapper } from '#/page-wrapper';
import { Route } from '#/routes/_protected/collections';

import { collectionTableColumns } from './columns';
import { AddCollectionForm } from './components/AddCollectionForm';

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
