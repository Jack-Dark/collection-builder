import { Table } from '#/components/Table';
import { PageWrapper } from '#/page-wrapper';

import { Route as AddCollectionRoute } from '../../routes/_protected/collections/add';
import { collectionTableColumns } from './columns';
import { AddCollectionForm } from './components/AddCollectionForm';

export const AddCollectionPage = () => {
  const { collections } = AddCollectionRoute.useLoaderData();

  return (
    <PageWrapper title="Add Collection">
      <AddCollectionForm />
      <Table columns={collectionTableColumns} data={collections.data} />
    </PageWrapper>
  );
};
