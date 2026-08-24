import type { RowData } from '@tanstack/react-table';

export interface TableCellActionsMenuPropsDef<TData extends RowData> {
  deleteIsDisabled?: boolean;
  deleteLabel?: string;
  deleteOnClick: (data: TData) => void | Promise<void>;
  disabled?: boolean;
  editIsDisabled?: boolean;
  editLabel?: string;
  editOnClick: (data: TData) => void | Promise<void>;
  isEditing: boolean;
  onCancelEdit: (data: TData) => void;
  rowData: TData;
}
