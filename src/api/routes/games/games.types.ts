import type { gamesTable } from './games.schema';

export type GameRecordDef = typeof gamesTable.$inferSelect;

export type NewGameRecordDef = typeof gamesTable.$inferInsert;
