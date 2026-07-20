import type { CellContext } from '@tanstack/react-table';

import type { CollectionItemRecordDef } from '#/api/routes/collection-items/collection-item.types';

export type CollectionDetailsActionsCellPropsDef = CellContext<
  CollectionItemRecordDef,
  number
> & {
  onCancel: () => void;
  onEditClick: (...rowIdsToAdd: string[]) => void;
};
