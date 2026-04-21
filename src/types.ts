import type { LinkProps } from '@tanstack/react-router';

export type RouterPath = LinkProps['to'];

/**
 * Usage:
 * ```ts
 * const myObjectMap = {...} as const;
 *
 * type MyObjectDef = ObjectValues<typeof myObjectMap>
 * ```
 * */
export type ObjectValues<T extends Record<any, any>> = T[keyof T];
