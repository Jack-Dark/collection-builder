import type { TimestampsDef } from '#/api/types';

import type { games } from '../../../schema';

export type GameRecordDef = typeof games.$inferSelect;

export type NewGameRecordDef = typeof games.$inferInsert;

export type UpdateGameRecordDef = Partial<
  Omit<GameRecordDef, 'id' | 'userId' | keyof TimestampsDef>
> &
  Pick<GameRecordDef, 'id'>;
