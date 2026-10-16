import { createAtom } from '@tanstack/react-store';

import { useEditingRowIds } from '../../../components/Table/hooks/use-editing-row-ids';

const editingCollectionsRowsAtom = createAtom<string[]>([]);

export const useEditingCollectionsRowIds = () => {
  return useEditingRowIds(editingCollectionsRowsAtom);
};
