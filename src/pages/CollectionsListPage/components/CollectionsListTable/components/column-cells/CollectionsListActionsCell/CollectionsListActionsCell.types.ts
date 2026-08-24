import type { CreateOrUpdateCollectionFormRecordDef } from '#/pages/CollectionsListPage/CollectionsListPage.types';

export type CollectionsListActionsCellPropsDef = {
  onCancel: () => void;
  onEditClick: (...rowIdsToAdd: string[]) => void;
  rowData: CreateOrUpdateCollectionFormRecordDef;
  rowId: CreateOrUpdateCollectionFormRecordDef['id'];
};
