import { create } from 'zustand';

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const getCreateDefaultZustandState = <T extends Exclude<any, Function>>(
  defaultValue: T,
) => {
  return create<{
    getSnapshot: () => T;
    getValue: () => T;
    resetValue: () => void;
    restoreFromSnapshot: () => void;
    /** Create a cached value saved as `snapshot`. If no new value is provided, the current value is used. */
    saveSnapshot: (updatedValue?: T) => void;
    setValue: SetZustandStateFnDef<T>;
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

export type SetZustandStateFnDef<T> = (
  value: T | ((prevValue: T) => T),
) => void;
