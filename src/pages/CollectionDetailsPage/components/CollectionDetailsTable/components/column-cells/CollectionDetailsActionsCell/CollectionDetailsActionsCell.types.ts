import type { CellContext } from '@tanstack/react-table';

import type { TableFeaturesDef } from '#/components/Table';
import type {
  CreateOrUpdateCollectionItemFormRowDataDef,
  CreateOrUpdateCollectionItemFormTypeDef,
} from '#/pages/CollectionDetailsPage/CollectionDetailsPage.types';

export type CollectionDetailsActionsCellPropsDef = CellContext<
  TableFeaturesDef,
  CreateOrUpdateCollectionItemFormRowDataDef,
  CreateOrUpdateCollectionItemFormRowDataDef['id']
> & {
  form: CreateOrUpdateCollectionItemFormTypeDef;
  onCancel: () => void;
  onEditClick: (...rowIdsToAdd: string[]) => void;
};
