import type { CustomFieldTypeDef } from '#/api/db-tables-schema.types';

import type { CreateOrUpdateCollectionItemFormTypeDef } from '../../CollectionDetailsPage.types';

export type GetCollectionItemsTableColumnsPropsDef = {
  customFields: {
    id: number;
    name: string;
    type: CustomFieldTypeDef;
  }[];
  form: CreateOrUpdateCollectionItemFormTypeDef;
  onCancel: () => void;
  onEditClick: (...rowIdsToAdd: string[]) => void;
};
