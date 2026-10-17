import type { JSXElementConstructor, JSX } from 'react';

export type MenuItemLabelPropsDef = {
  Label: string | JSXElementConstructor<{}> | JSX.Element;
};
