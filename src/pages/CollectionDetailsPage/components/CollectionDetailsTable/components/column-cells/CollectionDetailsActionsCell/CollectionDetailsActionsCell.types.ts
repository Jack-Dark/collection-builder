import type { CreateOrUpdateCollectionItemFormTypeDef } from '#/pages/CollectionDetailsPage/CollectionDetailsPage.types';

export type CollectionDetailsActionsCellPropsDef = {
  form: CreateOrUpdateCollectionItemFormTypeDef;
  onCancel: () => void;
  onEditClick: (...rowIdsToAdd: string[]) => void;
  rowId: string;
  rowIndex: number;
};
