import type z from '../../node_modules/zod/v4/classic/external.d.cts';
import type { authSchema } from './auth-middleware.schema';

type AuthSchemaDef = z.output<typeof authSchema>;

export type AuthContextDef = Record<'user', AuthSchemaDef>;

export type DbQueryArgsDef<TData extends any> = [TData] extends [never]
  ? {
      context: AuthContextDef;
      data?: never;
    }
  : {
      context: AuthContextDef;
      data: TData;
    };
