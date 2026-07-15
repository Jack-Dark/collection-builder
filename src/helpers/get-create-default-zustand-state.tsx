import { create } from 'zustand';

/**
 * @example
 * const create[STORE_NAME]Store = <TData extends DATA_TYPE>(defaultValue: TData) => {
 *   const createStore = getCreateDefaultZustandStore<TData>(defaultValue);
 *
 *   return () => {
 *     const {
 *       getSnapshot,
 *       getValue,
 *       resetValue,
 *       restoreFromSnapshot,
 *       saveSnapshot,
 *       setValue,
 *       snapshot,
 *       value,
 *     } = createStore();
 *
 *     return {
 *       getSnapshot,
 *       getValue,
 *       resetValue,
 *       restoreFromSnapshot,
 *       saveSnapshot,
 *       setValue,
 *       snapshot,
 *       value,
 *     };
 *   };
 * }
 *
 * export const use[STORE_NAME]Store = create[STORE_NAME]Store();
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const getCreateDefaultZustandStore = <T extends Exclude<any, Function>>(
  defaultValue: T,
) => {
  return create<{
    getSnapshot: () => T;
    getValue: () => T;
    logSnapshotToConsole: (...firstLogs: any[]) => void;
    logValueToConsole: (...firstLogs: any[]) => void;
    resetValue: () => void;
    restoreFromSnapshot: () => void;
    /** Create a cached value saved as `snapshot`. If no new value is provided, the current value is used. */
    saveSnapshot: (updatedValue?: T) => void;
    setValue: SetZustandStoreFnDef<T>;
    /** Used in conjunction with `setSnapshot` to create a cached value. */
    snapshot: T;
    value: T;
  }>((set, get) => {
    return {
      getSnapshot: () => {
        const { snapshot } = get();

        return snapshot;
      },
      getValue: () => {
        const { value } = get();

        return value;
      },
      logSnapshotToConsole: (...firstLogs: any[]) => {
        const { snapshot } = get();

        console.log(...firstLogs, snapshot);
      },
      logValueToConsole: (...firstLogs: any[]) => {
        const { value } = get();

        console.log(...firstLogs, value);
      },
      resetValue: () => {
        set({ value: defaultValue });
      },
      restoreFromSnapshot: () => {
        const { snapshot } = get();

        set({ value: snapshot });
      },
      saveSnapshot: (updatedValue) => {
        if (updatedValue) {
          set({ snapshot: updatedValue });
        } else {
          const { value } = get();

          set({ snapshot: value });
        }
      },
      set,
      setValue: (valueOrCallback) => {
        if (typeof valueOrCallback === 'function') {
          const { value: prevValue } = get();

          // @ts-expect-error
          const newValue = valueOrCallback(prevValue);

          set({ value: newValue });
        } else {
          set({ value: valueOrCallback });
        }
      },
      snapshot: defaultValue,
      value: defaultValue,
    };
  });
};

export type SetZustandStoreFnDef<T> = (
  value: T | ((prevValue: T) => T),
) => void;
