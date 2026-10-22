import type { impersonateUserStopServerFn } from './impersonate-user-stop.serverFn';

export type ImpersonateUserStopRequestArgsDef = never;

export type ImpersonateUserStopResponseDef = Awaited<
  ReturnType<typeof impersonateUserStopServerFn>
>;
