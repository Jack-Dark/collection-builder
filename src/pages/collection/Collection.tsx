import type { RouteComponent } from '@tanstack/react-router';

import { Button, Typography, Stack } from '@mui/material';
import { useLoaderData } from '@tanstack/react-router';
import { Table } from '#/components/Table';
import { useState } from 'react';

import { AddGameForm } from './components/AddGameForm';
import { collectionTableColumns } from './constants';

export const Collection: RouteComponent = () => {
  const [showAddForm, setShowAddForm] = useState<boolean>(true);

  const games = useLoaderData({ from: '/collection/' });

  return (
    <main className="page-wrap px-4 py-12">
      <section className="bg-white text-black rounded-2xl p-6 sm:p-8">
        <Stack spacing={4}>
          <Button
            onClick={() => {
              setShowAddForm((prev) => {
                return !prev;
              });
            }}
          >
            <Typography>{showAddForm ? 'Hide Form' : 'Add Game'}</Typography>
          </Button>
          {showAddForm && <AddGameForm />}
          <Table columns={collectionTableColumns} data={games} />
        </Stack>
      </section>
    </main>
  );
};
