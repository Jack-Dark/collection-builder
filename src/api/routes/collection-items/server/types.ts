import type { TimestampsDef } from '#/api/types';

import type { collectionItemsTable } from '../../../schema';

export type GameRecordDef = typeof collectionItemsTable.$inferSelect;

export type NewGameRecordDef = typeof collectionItemsTable.$inferInsert;

export type UpdateGameRecordDef = Partial<
  Omit<GameRecordDef, 'id' | 'userId' | keyof TimestampsDef>
> &
  Pick<GameRecordDef, 'id' | 'userId'>;
