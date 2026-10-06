import type { CellContext } from '@tanstack/react-table';

import type { TTableFeatures } from '#/components/Table';
import type {
  CreateOrUpdateCollectionItemFormRowDataDef,
  CreateOrUpdateCollectionItemFormTypeDef,
} from '#/pages/CollectionDetailsPage/CollectionDetailsPage.types';

export type CollectionDetailsActionsCellPropsDef = CellContext<
  TTableFeatures,
  CreateOrUpdateCollectionItemFormRowDataDef,
  CreateOrUpdateCollectionItemFormRowDataDef['id']
> & {
  form: CreateOrUpdateCollectionItemFormTypeDef;
  onCancel: () => void;
  onEditClick: (...rowIdsToAdd: string[]) => void;
};
