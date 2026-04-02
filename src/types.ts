import type { FileRoutesByFullPath } from './routeTree.gen';

export type RouterPath = keyof FileRoutesByFullPath;

/**
 * Usage:
 * ```ts
 * const myObjectMap = {...} as const;
 *
 * type MyObjectDef = ObjectValues<typeof myObjectMap>
 * ```
 * */
export type ObjectValues<T extends Record<any, any>> = T[keyof T];
