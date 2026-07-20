import type { AppFieldExtendedReactFormApi } from '@tanstack/react-form';

import type { CollectionRecordDef } from '#/api/routes/collections/collection.types';

import type { CreateOrUpdateCollectionItemFormDataDef } from '../../CollectionDetailsPage.types';

export type GetCollectionItemsTableColumnsPropsDef = Pick<
  CollectionRecordDef,
  | 'customField1Enabled'
  | 'customField1Label'
  | 'customField2Enabled'
  | 'customField2Label'
  | 'customField3Enabled'
  | 'customField3Label'
> & {
  form: AppFieldExtendedReactFormApi<
    CreateOrUpdateCollectionItemFormDataDef,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >;
  onCancel: () => void;
  onEditClick: (...rowIdsToAdd: string[]) => void;
};
