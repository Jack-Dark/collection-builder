import type { GameRecordDef } from '#/api/routes/games/games.types';

import { Typography } from '@mui/material';
import { createColumnHelper } from '@tanstack/react-table';
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
];
