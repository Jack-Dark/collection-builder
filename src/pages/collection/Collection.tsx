import type { RouteComponent } from '@tanstack/react-router';

import { useLoaderData } from '@tanstack/react-router';
import { Button } from '#/components/Button';
import { Table } from '#/components/Table';
import { useState } from 'react';

import { AddGameForm } from './components/AddGameForm';
import { collectionTableColumns } from './constants';

export const Collection: RouteComponent = () => {
  const [showAddForm, setShowAddForm] = useState<boolean>(true);

  const games = useLoaderData({ from: '/_app/collection' });

  return (
    <main className="page-wrap px-4 py-12">
      <section className="bg-white text-black rounded-2xl p-6 sm:p-8">
        <div>
          <Button
            onClick={() => {
              setShowAddForm((prev) => {
                return !prev;
              });
            }}
          >
            <p>{showAddForm ? 'Hide Form' : 'Add Game'}</p>
          </Button>
          {showAddForm && <AddGameForm />}
          <Table columns={collectionTableColumns} data={games} />
        </div>
      </section>
    </main>
  );
};
