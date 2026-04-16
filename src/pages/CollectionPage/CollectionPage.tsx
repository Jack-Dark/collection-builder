import type { RouteComponent } from '@tanstack/react-router';

import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useMutation } from '@tanstack/react-query';
import { useLoaderData, useRouter } from '@tanstack/react-router';
import { apiRoutes } from '#/api/routes';
import { Button } from '#/components/Button';
import { Table } from '#/components/Table';
import { useGetUserId } from '#/hooks/useGetUserId';
import { useState } from 'react';

import { AddGameForm } from './components/AddGameForm';
import { collectionTableColumns } from './constants.columns';

export const CollectionPage: RouteComponent = () => {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const router = useRouter();

  const { validateUserToCallback } = useGetUserId();

  const { games, lastAddedSystem } = useLoaderData({
    from: '/_protected/collection',
  });

  const toggleForm = () => {
    setShowAddForm((prev) => {
      return !prev;
    });
  };

  const { isPending: isCreateMockGamesPending, mutate: handleCreateMockGames } =
    useMutation({
      mutationFn: async () => {
        validateUserToCallback(async (userId) => {
          await apiRoutes.games.createMockGames(userId);
        });
      },
      onSuccess: async () => {
        await router.invalidate();
      },
    });

  const { isPending: isDeleteAllGamesPending, mutate: handleDeleteAllGames } =
    useMutation({
      mutationFn: async () => {
        validateUserToCallback(async (userId) => {
          await apiRoutes.games.deleteAllGames(userId);
        });
      },
      onSuccess: async () => {
        await router.invalidate();
      },
    });

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
          Add Game
        </Button>
      )}

      <Button
        className="justify-self-start"
        onClick={async () => {
          await handleCreateMockGames();
        }}
        processing={isCreateMockGamesPending}
        variant="secondary"
      >
        Add Mock Games Data
      </Button>
      <Button
        className="justify-self-start"
        onClick={async () => {
          await handleDeleteAllGames();
        }}
        processing={isDeleteAllGamesPending}
        variant="alert"
      >
        Delete All Games
      </Button>

      {showAddForm && <AddGameForm lastAddedSystem={lastAddedSystem} />}

      <Table columns={collectionTableColumns} data={games.data} />
    </section>
  );
};
