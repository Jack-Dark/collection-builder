/**
 * @example
 * const query = (body: FetchStockSummaryArgs) =>
 *   axios
 *     .post<FetchStockSummaryResponse>(`${coreApiUrl}/EXAMPLE_URL`, body)
 *     .then(({ data }) => data);
 *
 * export const fetchStockSummaryQueryObj = getGenericQueryObj({
 *   query,
 * });
 */

import type { GetGenericQueryObjProps } from './get-generic-query-obj.types';

export const getGenericQueryObj = <
  TRequestArgs extends Record<string, any> | never,
  TResponseDef extends Record<string, any>,
>(
  props: GetGenericQueryObjProps<TRequestArgs, TResponseDef>,
) => {
  const { groupName, query } = props;

  const groupKey = () => {
    return groupName;
  };

  const key = (args?: TRequestArgs) => {
    const key = [
      groupKey(),
      JSON.stringify(
        // // TODO: not all keys are valid to be included it as part of the key
        // omit(args, ['enabled', 'transform', 'transformDependencies']),

        args,
      ),
    ].join('|');

    return [
      {
        groupKey: groupKey(),
        key,
      },
    ] as const;
  };

  return {
    groupKey,
    key,
    query,
  };
};
