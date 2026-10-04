import type { CustomFieldTypeDef } from '#/api/db-tables-schema.types';
import type { CollectionRecordDef } from '#/api/routes/collections/collection.types';

import type { CreateOrUpdateCollectionItemFormTypeDef } from '../../CollectionDetailsPage.types';

export type GetCollectionItemsTableColumnsPropsDef = Pick<
  CollectionRecordDef,
  | 'customField1Enabled'
  | 'customField1Label'
  | 'customField2Enabled'
  | 'customField2Label'
  | 'customField3Enabled'
  | 'customField3Label'
> & {
  customFields: {
    id: number;
    name: string;
    type: CustomFieldTypeDef;
  }[];
  form: CreateOrUpdateCollectionItemFormTypeDef;
  onCancel: () => void;
  onEditClick: (...rowIdsToAdd: string[]) => void;
};
