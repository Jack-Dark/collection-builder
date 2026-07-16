import { getCreateDefaultZustandStore } from '#/helpers/get-create-default-zustand-state';

import { addCollectionItemFormDefaultValues } from '../../add-or-update-collection-item-form.form';

export const createFormStore = <TData extends Record<string, any>>(
  defaultValues: TData,
) => {
  const createFormValuesStore = getCreateDefaultZustandStore(defaultValues);

  return () => {
    const { restoreFromSnapshot, saveSnapshot, setValue, snapshot, value } =
      createFormValuesStore();

    return {
      defaultValues: snapshot,
      formValues: value,
      /** Resets form to the default values. */
      resetFormValues: restoreFromSnapshot,
      setFormValues: setValue,
      updateDefaultValues: (newValues: Partial<TData>) => {
        saveSnapshot({ ...defaultValues, ...newValues });
      },
    };
  };
};

export const useCollectionItemsFormStore = createFormStore(
  addCollectionItemFormDefaultValues,
);
