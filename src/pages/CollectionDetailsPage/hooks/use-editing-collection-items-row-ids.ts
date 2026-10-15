import { createAtom } from '@tanstack/react-store';

import { useEditingRowIds } from '../../../components/Table/hooks/use-editing-row-ids';

const editingCollectionItemsRowsAtom = createAtom<string[]>([]);

export const useEditingCollectionItemsRowIds = () => {
  return useEditingRowIds(editingCollectionItemsRowsAtom);
};
