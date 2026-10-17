export type TableSettingsMenuPropsDef =
  | {
      enableIgnoreSortArticles?: never;
      ignoreSortArticles?: never;
      onClickIgnoreSortArticles?: never;
    }
  | {
      enableIgnoreSortArticles: boolean;
      ignoreSortArticles: boolean;
      onClickIgnoreSortArticles: (checked: boolean) => void;
    };
