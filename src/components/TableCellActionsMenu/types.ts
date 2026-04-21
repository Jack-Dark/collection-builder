import type { RowData, Row } from '@tanstack/react-table';

export interface TableCellActionsMenuPropsDef<TData extends RowData> {
  deleteIsDisabled?: boolean;
  deleteLabel?: string;
  deleteOnClick: (data: TData) => void | Promise<void>;
  editIsDisabled?: boolean;
  editLabel?: string;
  editOnClick: (data: TData) => void | Promise<void>;
  row: Row<TData>;
}
