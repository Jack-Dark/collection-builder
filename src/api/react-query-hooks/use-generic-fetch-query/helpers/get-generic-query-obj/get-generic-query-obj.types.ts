export interface GetGenericQueryObjProps<
  TRequestArgs extends Record<string, any> | never,
  TResponseDef extends Record<any, any>,
> {
  groupName: string;
  query: (args?: TRequestArgs) => Promise<TResponseDef>;
}
