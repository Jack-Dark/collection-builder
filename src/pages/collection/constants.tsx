import type { GameRecordDef } from '#/api/routes/games/server/types';

import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useRouter } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import { apiRoutes } from '#/api/routes';
import { Button } from '#/components/Button';
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
      const text = getValue();

      return text ? <p>{text}</p> : null;
    },
    header: 'Edition',
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
    header: 'Edition',
  }),
  columnHelper.accessor('id', {
    cell: ({ getValue }) => {
      const router = useRouter();
      const id = getValue();

      // TODO - create Menu component that is toggled on a 3-dot icon (or SettingsIcon?)
      return (
        <div className="flex flex-nowrap gap-2 justify-end items-center">
          <Button
            disabled
            onClick={() => {
              // apiRoutes.games.updateById(id);
            }}
            size="xs"
            variant="ghost"
          >
            <EditIcon />
          </Button>
          <Button size="xs" variant="ghost">
            <DeleteIcon
              className="text-red-700"
              onClick={async () => {
                await apiRoutes.games.deleteById(id);
                router.invalidate();
              }}
            />
          </Button>
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
