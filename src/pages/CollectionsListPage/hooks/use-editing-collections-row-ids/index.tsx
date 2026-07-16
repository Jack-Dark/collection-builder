import { getCreateDefaultZustandStore } from '../../../../helpers/get-create-default-zustand-state';

const createEditingRowIdsStore = (defaultValue: string[] = []) => {
  const createState = getCreateDefaultZustandStore<string[]>(defaultValue);

  return () => {
    const { getValue, resetValue, setValue, value } = createState();

    return {
      addToEditingRowIds: (...valuesToAdd: string[]) => {
        setValue((prevValues) => {
          return [...prevValues, ...valuesToAdd];
        });
      },
      editingRowIds: value,
      getIsEditingRowId: (id: string) => {
        const currentValue = getValue();

        return currentValue.includes(id);
      },
      isEditing: !!value.length,
      removeFromIsEditingRowIds: (...valuesToRemove: string[]) => {
        setValue((prevValues) => {
          return prevValues.filter((prevValue) => {
            const isInPrevValues = valuesToRemove.includes(prevValue);

            return !isInPrevValues;
          });
        });
      },
      resetEditingRowIds: resetValue,
      setEditingRowIds: setValue,
    };
  };
};

export const useEditingCollectionsRowIds = createEditingRowIdsStore();

export const useEditingCollectionItemsRowIds = createEditingRowIdsStore();
