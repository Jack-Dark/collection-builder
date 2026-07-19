import type { CollectionDetailsFiltersSchemaDef } from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.types';

import { getCreateDefaultZustandStore } from '#/helpers/get-create-default-zustand-state';

const createCollectionDetailsFiltersStore = (
  defaultValues: CollectionDetailsFiltersSchemaDef,
) => {
  const createCustomField1Store = getCreateDefaultZustandStore<string[]>(
    defaultValues.customField1,
  );
  const createCustomField2Store = getCreateDefaultZustandStore<string[]>(
    defaultValues.customField2,
  );
  const createCustomField3Store = getCreateDefaultZustandStore<string[]>(
    defaultValues.customField3,
  );

  return () => {
    const customField1Store = createCustomField1Store();
    const customField2Store = createCustomField2Store();
    const customField3Store = createCustomField3Store();

    const getAllFilters = (): CollectionDetailsFiltersSchemaDef => {
      return {
        customField1: customField1Store.getValue(),
        customField2: customField2Store.getValue(),
        customField3: customField3Store.getValue(),
      };
    };

    return {
      customField1Store,
      customField2Store,
      customField3Store,
      defaultValues,
      filters: {
        customField1: customField1Store.value,
        customField2: customField2Store.value,
        customField3: customField3Store.value,
      },
      getAllFilters,
      resetAllFilters: () => {
        customField1Store.resetValue();
        customField2Store.resetValue();
        customField3Store.resetValue();
      },
      restoreAllFiltersFromSnapshot: () => {
        customField1Store.restoreFromSnapshot();
        customField2Store.restoreFromSnapshot();
        customField3Store.restoreFromSnapshot();
      },
      saveAllFiltersSnapshot: () => {
        return {
          customField1: customField1Store.saveSnapshot(),
          customField2: customField2Store.saveSnapshot(),
          customField3: customField3Store.saveSnapshot(),
        };
      },
      setAllFilters: (
        valueOrSetStore:
          | CollectionDetailsFiltersSchemaDef
          | ((prevValue: CollectionDetailsFiltersSchemaDef) => void),
      ) => {
        if (typeof valueOrSetStore === 'function') {
          const currentValue = getAllFilters();
          valueOrSetStore(currentValue);
        } else {
          const { customField1, customField2, customField3 } = valueOrSetStore;

          customField1Store.setValue(customField1);
          customField2Store.setValue(customField2);
          customField3Store.setValue(customField3);
        }
      },
    };
  };
};

export const useCollectionDetailsFiltersStore =
  createCollectionDetailsFiltersStore({
    customField1: [],
    customField2: [],
    customField3: [],
  });
