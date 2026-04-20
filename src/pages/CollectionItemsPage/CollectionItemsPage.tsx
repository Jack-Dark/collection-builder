import type { RouteComponent } from '@tanstack/react-router';

import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { apiRoutes } from '#/api/routes';
import { Button } from '#/components/Button';
import { Table } from '#/components/Table';
import { useGetUserId } from '#/hooks/useGetUserId';
import { PageWrapper } from '#/page-wrapper';
import { Route as CollectionsRoute } from '#/routes/_protected/collections/$id';
import { useState } from 'react';

import { collectionTableColumns } from './columns';
import { AddGameForm } from './components/AddGameForm';

export const CollectionPage: RouteComponent = () => {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const router = useRouter();

  const { validateUserToCallback } = useGetUserId();

  const { collection, items, lastAddedSystem } =
    CollectionsRoute.useLoaderData();

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

      <Table columns={collectionTableColumns} data={items || []} />
    </PageWrapper>
  );
};
