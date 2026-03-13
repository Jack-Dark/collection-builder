import type { TimestampsDef } from '#/api/common';

import type { gamesTable } from './schema';

export type GameRecordDef = typeof gamesTable.$inferSelect;

export type NewGameRecordDef = typeof gamesTable.$inferInsert;

export type UpdateGameRecordDef = Partial<
  Omit<GameRecordDef, 'id' | 'userId' | keyof TimestampsDef>
>;
