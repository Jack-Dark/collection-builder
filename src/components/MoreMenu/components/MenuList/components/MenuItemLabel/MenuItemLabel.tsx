import type { MenuItemLabelPropsDef } from './MenuItemLabel.types';

export const MenuItemLabel = (props: MenuItemLabelPropsDef) => {
  const { label } = props;

  return typeof label === 'string' ? label : <label />;
};
