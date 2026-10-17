import type { CheckboxGroupProps } from '@base-ui/react';

type CheckboxGroupItem = {
  disabled?: boolean;
  label: string;
  value: string;
};
export type CheckboxGroupFieldPropsDef = CheckboxGroupProps & {
  items: CheckboxGroupItem[];
  name: string;
  onValueChange: (selectedItems: string[]) => void;
  value: string[];
};
