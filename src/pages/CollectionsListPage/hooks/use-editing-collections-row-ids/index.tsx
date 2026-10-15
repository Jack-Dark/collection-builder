import { createAtom, useAtom } from '@tanstack/react-store';
import { useCallback } from 'react';

import { createEditingTableRowIdsStore } from '../../../../helpers/create-editing-table-row-ids-store';

export const useEditingCollectionsRowIds = createEditingTableRowIdsStore();

const editingCollectionItemsRowsAtom = createAtom<string[]>([]);

export const useEditingCollectionItemsRowIds = () => {
  const [editingRowIds, setEditingRowIds] = useAtom(
    editingCollectionItemsRowsAtom,
  );

  const addToEditingRowIds = (...idsToAdd: string[]) => {
    setEditingRowIds((prevRowIds) => {
      return [...prevRowIds, ...idsToAdd];
    });
  };

  const removeFromEditingRowIds = (...idsToRemove: string[]) => {
    setEditingRowIds((prevRowIds) => {
      return prevRowIds.filter((id) => {
        const isIdToRemove = idsToRemove.includes(id);

        return !isIdToRemove;
      });
    });
  };

  const getHasNewRecord = useCallback(() => {
    return editingRowIds.some(getIsNewRecord);
  }, [editingRowIds]);

  const getIsEditingRowId = useCallback(
    (id: string) => {
      return editingRowIds.some((rowId) => {
        return rowId === id;
      });
    },
    [editingRowIds],
  );

  const getLastNewRecordIndex = useCallback(() => {
    return editingRowIds.reduce((acc, rowId, index) => {
      const isNewRecord = getIsNewRecord(String(rowId));

      return isNewRecord ? index : acc;
    }, 0);
  }, [editingRowIds]);

  const resetEditingRowIds = () => {
    setEditingRowIds([]);
  };

  return {
    addToEditingRowIds,
    editingRowIds,
    getHasNewRecord,
    getIsEditingRowId,
    getLastNewRecordIndex,
    isEditing: !!editingRowIds.length,
    removeFromEditingRowIds,
    resetEditingRowIds,
    setEditingRowIds,
  };
};

const getIsNewRecord = (rowId: string) => {
  const rowIdNumber = Number(rowId);
  const isRowIdString = Number.isNaN(rowIdNumber);

  return isRowIdString;
};
