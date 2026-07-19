export type SearchProps = {
  onChange: (search: string) => void | Promise<void>;
  value: string;
} & (
  | {
      onClickSearchNotes?: never;
      searchNotes?: never;
    }
  | {
      onClickSearchNotes: (checked: boolean) => void;
      searchNotes: boolean;
    }
);
