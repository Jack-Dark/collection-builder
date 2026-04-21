import type { CollectionItemRecordDef } from '#/api/routes/collection-items/server/types';

import { useRouter } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import {
  useDeleteCollectionItem,
  useUpdateCollectionItem,
} from '#/api/routes/collection-items/client/hooks';
import { MoreMenu } from '#/components/MoreMenu';
import formatDate, { masks } from 'dateformat';

const columnHelper = createColumnHelper<CollectionItemRecordDef>();

export const collectionItemsTableColumns = [
  columnHelper.accessor('name', {
    cell: ({ getValue }) => {
      return <p>{getValue()}</p>;
    },
    header: 'Name',
  }),
  columnHelper.accessor('system', {
    cell: ({ getValue }) => {
      return <p>{getValue()}</p>;
    },
    header: 'System',
  }),
  columnHelper.accessor('editionDetails', {
    cell: ({ getValue }) => {
      return <p>{getValue() || '-'}</p>;
    },
    header: 'Edition',
  }),
  columnHelper.accessor('notes', {
    cell: ({ getValue }) => {
      return <p>{getValue() || '-'}</p>;
    },
    header: 'Notes',
  }),
  columnHelper.accessor('createdAt', {
    cell: ({ getValue }) => {
      const date = getValue();

      return date ? (
        <p>
          {formatDate(date, `${masks.paddedShortDate} @ ${masks.shortTime}`)}
        </p>
      ) : null;
    },
    header: 'Added',
  }),
  columnHelper.accessor('id', {
    cell: ({ getValue, row }) => {
      const router = useRouter();
      const id = getValue();

      const gameData = row.original;

      const { isPending: isUpdatePending, onUpdateCollectionItem } =
        useUpdateCollectionItem();

      const { isPending: isDeletePending, onDeleteCollectionItem } =
        useDeleteCollectionItem();

      return (
        <div className="flex flex-nowrap gap-2 justify-end items-center">
          <MoreMenu
            items={[
              {
                disabled: isUpdatePending || isDeletePending || true,
                label: 'Edit',
                onClick: async () => {
                  // apiRoutes.games.updateById(id);
                  // await updateCollectionItem({ data: gameData });
                },
              },
              {
                disabled: isUpdatePending || isDeletePending,
                label: 'Delete',
                onClick: async () => {
                  await onDeleteCollectionItem({ data: id });
                  router.invalidate();
                },
              },
            ]}
          />
        </div>
      );
    },
    header: () => {
      return <p className="text-right">Actions</p>;
    },
    id: 'actions',
    size: 0,
  }),
];
