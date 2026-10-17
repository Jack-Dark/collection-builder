import type { MenuItemLabelPropsDef } from './MenuItemLabel.types';

export const MenuItemLabel = (props: MenuItemLabelPropsDef) => {
  const { Label } = props;

  return typeof Label === 'string' || typeof Label === 'object' ? (
    Label
  ) : (
    <Label />
  );
};
