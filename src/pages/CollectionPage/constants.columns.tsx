import type { GameRecordDef } from '#/api/routes/games/server/types';

import { useRouter } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import { apiRoutes } from '#/api/routes';
import { MoreMenu } from '#/components/MoreMenu';
import formatDate, { masks } from 'dateformat';

const columnHelper = createColumnHelper<GameRecordDef>();

export const collectionTableColumns = [
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
    cell: ({ getValue }) => {
      const router = useRouter();
      const id = getValue();

      return (
        <div className="flex flex-nowrap gap-2 justify-end items-center">
          <MoreMenu
            items={[
              {
                disabled: true,
                label: 'Edit',
                onClick: () => {
                  // apiRoutes.games.updateById(id);
                },
              },
              {
                label: 'Delete',
                onClick: async () => {
                  await apiRoutes.games.deleteById(id);
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
