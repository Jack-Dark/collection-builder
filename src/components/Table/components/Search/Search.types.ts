export type SearchProps = {
  onValueChange: (search: string) => void | Promise<void>;
  value: string;
};
