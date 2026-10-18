import type { Atom } from '@tanstack/react-store';

import { useAtom } from '@tanstack/react-store';
import { useCallback } from 'react';

export const useEditingRowIds = (atom: Atom<string[]>) => {
  const [editingRowIds, setEditingRowIds] = useAtom(atom);

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

  const isEditing = !!editingRowIds.length;

  return {
    addToEditingRowIds,
    editingRowIds,
    getHasNewRecord,
    getIsEditingRowId,
    getLastNewRecordIndex,
    isEditing,
    removeFromEditingRowIds,
    resetEditingRowIds,
    setEditingRowIds,
  };
};

const getIsNewRecord = (rowId: string) => {
  const rowIdNumber = Number(rowId);
  // ? by default row IDs use the `id` value from the row data, which is expected to be a number
  const isRowIdString = Number.isNaN(rowIdNumber);

  return isRowIdString;
};
