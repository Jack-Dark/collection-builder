import type { RouteComponent } from '@tanstack/react-router';

import { useLoaderData } from '@tanstack/react-router';
import { Button } from '#/components/Button';
import { Table } from '#/components/Table';
import { useState } from 'react';

import { AddGameForm } from './components/AddGameForm';
import { collectionTableColumns } from './constants';

export const Collection: RouteComponent = () => {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const games = useLoaderData({ from: '/_app/collection' });

  return (
    <section className="grid gap-4">
      <Button
        className="justify-self-start"
        onClick={() => {
          setShowAddForm((prev) => {
            return !prev;
          });
        }}
        variant={showAddForm ? 'secondary' : 'primary'}
      >
        <p>{showAddForm ? 'Hide Form' : 'Add Game'}</p>
      </Button>

      {showAddForm && <AddGameForm />}
      <Table columns={collectionTableColumns} data={games} />
    </section>
  );
};
