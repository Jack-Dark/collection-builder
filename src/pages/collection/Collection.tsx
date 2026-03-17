import type { RouteComponent } from '@tanstack/react-router';

import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useLoaderData } from '@tanstack/react-router';
import { Button } from '#/components/Button';
import { Table } from '#/components/Table';
import { useState } from 'react';

import { AddGameForm } from './components/AddGameForm';
import { collectionTableColumns } from './constants.columns';

export const Collection: RouteComponent = () => {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const { games, lastAddedSystem } = useLoaderData({
    from: '/_app/collection',
  });

  const toggleForm = () => {
    setShowAddForm((prev) => {
      return !prev;
    });
  };

  return (
    <section className="grid gap-8">
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
          <p>Add Game</p>
        </Button>
      )}

      {showAddForm && <AddGameForm lastAddedSystem={lastAddedSystem} />}

      <Table columns={collectionTableColumns} data={games} />
    </section>
  );
};
