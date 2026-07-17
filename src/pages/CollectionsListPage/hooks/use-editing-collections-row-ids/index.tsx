import { getCreateDefaultZustandStore } from '../../../../helpers/get-create-default-zustand-state';

const createEditingRowIdsStore = (defaultValue: string[] = []) => {
  const createState = getCreateDefaultZustandStore<string[]>(defaultValue);

  return () => {
    const { getValue, resetValue, setValue, value } = createState();

    const getIsNewRecord = (rowId: string) => {
      return Number.isNaN(Number(rowId));
    };

    const getIsCreatingRecord = () => {
      return value.some((id) => {
        return getIsNewRecord(id);
      });
    };

    const getLastNewRecordIndex = () => {
      return value.reduce((acc, rowId, index) => {
        const isNewRecord = getIsNewRecord(String(rowId));

        return isNewRecord ? index : acc;
      }, 0);
    };

    return {
      addToEditingRowIds: (...valuesToAdd: string[]) => {
        setValue((prevValues) => {
          return [...prevValues, ...valuesToAdd];
        });
      },
      editingRowIds: value,
      getIsCreatingRecord,
      getIsEditingRowId: (id: string) => {
        const currentValue = getValue();

        return currentValue.includes(id);
      },
      getLastNewRecordIndex,
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
