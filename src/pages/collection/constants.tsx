import type { GameRecordDef } from '#/api/routes/games/server/types';

import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import { useRouter } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import { apiRoutes } from '#/api/routes';
import formatDate, { masks } from 'dateformat';

const columnHelper = createColumnHelper<GameRecordDef>();

export const collectionTableColumns = [
  columnHelper.accessor('name', {
    cell: ({ getValue }) => {
      return <Typography>{getValue()}</Typography>;
    },
    header: 'Name',
  }),
  columnHelper.accessor('system', {
    cell: ({ getValue }) => {
      return <Typography>{getValue()}</Typography>;
    },
    header: 'System',
  }),
  columnHelper.accessor('editionDetails', {
    cell: ({ getValue }) => {
      const text = getValue();

      return text ? <Typography>{text}</Typography> : null;
    },
    header: 'Edition',
  }),
  columnHelper.accessor('createdAt', {
    cell: ({ getValue }) => {
      const date = getValue();

      return date ? (
        <Typography>
          {formatDate(date, `${masks.paddedShortDate} @ ${masks.shortTime}`)}
        </Typography>
      ) : null;
    },
    header: 'Edition',
  }),
  columnHelper.accessor('id', {
    cell: ({ getValue }) => {
      const router = useRouter();
      const id = getValue();

      return (
        <>
          <Button
            disabled
            onClick={() => {
              // apiRoutes.games.updateById(id);
            }}
          >
            <EditIcon />
          </Button>

          <Button
            onClick={async () => {
              await apiRoutes.games.deleteById(id);
              router.invalidate();
            }}
          >
            <DeleteIcon />
          </Button>
        </>
      );
    },
    header: '',
  }),
];
