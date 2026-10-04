import type { CellContext } from '@tanstack/react-table';

import type { CreateOrUpdateCollectionItemFormRowDataDef } from '#/pages/CollectionDetailsPage/CollectionDetailsPage.types';

export type CollectionDetailsActionsCellPropsDef = CellContext<
  CreateOrUpdateCollectionItemFormRowDataDef,
  CreateOrUpdateCollectionItemFormRowDataDef['id']
> & {
  onCancel: () => void;
  onEditClick: (...rowIdsToAdd: string[]) => void;
};
