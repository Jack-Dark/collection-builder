import type {
  CreateCollectionSchemaDef,
  UpdateCollectionSchemaDef,
} from '#/api/routes/collections/server/types';

export type AddCollectionFormSchemaDef =
  | CreateCollectionSchemaDef
  | UpdateCollectionSchemaDef;
