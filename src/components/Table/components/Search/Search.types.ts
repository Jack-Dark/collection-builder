export type SearchProps = {
  onChange: (search: string) => void | Promise<void>;
  value: string;
} & (
  | {
      enableSearchNotes?: never;
      onClickSearchNotes?: never;
      searchNotes?: never;
    }
  | {
      enableSearchNotes: boolean;
      onClickSearchNotes: (checked: boolean) => void;
      searchNotes: boolean;
    }
);
