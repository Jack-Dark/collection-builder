import type { CellContext } from '@tanstack/react-table';

import type { CollectionRecordDef } from '#/api/routes/collections/collection.types';

export type CollectionsListActionsCellPropsDef = CellContext<
  CollectionRecordDef,
  CollectionRecordDef['id']
> & {
  onCancel: () => void;
  onEditClick: (rowId?: string) => void;
};
