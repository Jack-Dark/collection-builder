import type { OrderedCustomFieldForCollectionDef } from '#/api/routes/collections/get-paginated-collections/get-paginated-collections.types';

import type { CreateOrUpdateCollectionItemFormTypeDef } from '../../CollectionDetailsPage.types';

export type GetCollectionItemsTableColumnsPropsDef = {
  customFields: OrderedCustomFieldForCollectionDef[];
  form: CreateOrUpdateCollectionItemFormTypeDef;
  onCancel: () => void;
  onEditClick: (...rowIdsToAdd: string[]) => void;
};
