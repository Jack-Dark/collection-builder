import type { RouteComponent } from '@tanstack/react-router';

import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Button } from '#/components/Button';
import { Table } from '#/components/Table';
import { PageWrapper } from '#/page-wrapper';
import { Route as CollectionRoute } from '#/routes/_protected/collections/$id';
import { useState } from 'react';

import { collectionItemsTableColumns } from './columns';
import { AddGameForm } from './components/AddGameForm';

export const CollectionPage: RouteComponent = () => {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const { collection, items, lastAddedSystem } =
    CollectionRoute.useLoaderData();

  const toggleForm = () => {
    setShowAddForm((prev) => {
      return !prev;
    });
  };

  return (
    <PageWrapper childrenClassName="grid gap-8" title={collection?.name || '-'}>
      {showAddForm ? (
        <Button
          className="justify-self-start flex flex-nowrap gap-2"
          onClick={toggleForm}
          variant="secondary"
        >
          <VisibilityOffIcon />
          <p>Hide Form</p>
        </Button>
      ) : (
        <Button
          className="justify-self-start"
          onClick={toggleForm}
          variant="primary"
        >
          Add Game
        </Button>
      )}

      {showAddForm && <AddGameForm lastAddedSystem={lastAddedSystem} />}

      <Table columns={collectionItemsTableColumns} data={items || []} />
    </PageWrapper>
  );
};
