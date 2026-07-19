export type SearchProps = {
  onClickSearchNotes: (checked: boolean) => void;
  onValueChange: (search: string) => void | Promise<void>;
  searchNotes: boolean;
  value: string;
};
