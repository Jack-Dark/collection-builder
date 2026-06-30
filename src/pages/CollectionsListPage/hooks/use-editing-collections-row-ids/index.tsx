import { getCreateDefaultZustandState } from '../../../../helpers/get-create-default-zustand-state';

const createEditingRowIdsState = <TData extends string | number>(
  defaultValue: TData[] = [],
) => {
  const createState = getCreateDefaultZustandState<TData[]>(defaultValue);

  return () => {
    const { getValue, resetValue, setValue, value } = createState();

    return {
      addToEditingRowIds: (...valuesToAdd: TData[]) => {
        setValue((prev) => {
          return [...prev, ...valuesToAdd];
        });
      },
      editingRowIds: value,
      getIsEditingRowId: (id: TData) => {
        const currentValue = getValue();

        return currentValue.includes(id);
      },
      isEditing: !!value.length,
      removeFromIsEditingRowIds: (...valuesToRemove: TData[]) => {
        setValue((prev) => {
          return prev.filter((prevValue) => {
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

export const useEditingCollectionsRowIds = createEditingRowIdsState();

export const useEditingCollectionItemsRowIds = createEditingRowIdsState();
