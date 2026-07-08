import { create } from 'zustand';

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const getCreateDefaultZustandState = <T extends Exclude<any, Function>>(
  defaultValue: T,
) => {
  return create<{
    getValue: () => T;
    resetValue: () => void;
    setValue: (value: T | ((currentValue: T) => T)) => void;
    value: T;
  }>((set, get) => {
    return {
      getValue: () => {
        const { value } = get();

        return value;
      },
      resetValue: () => {
        set({ value: defaultValue });
      },
      set,
      setValue: (valueOrCallback) => {
        if (typeof valueOrCallback === 'function') {
          const { value: currentValue } = get();

          // @ts-expect-error
          const newValue = valueOrCallback(currentValue);

          set({ value: newValue });
        } else {
          set({ value: valueOrCallback });
        }
      },
      value: defaultValue,
    };
  });
};
