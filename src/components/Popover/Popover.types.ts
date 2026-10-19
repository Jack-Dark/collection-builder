import type {
  PopoverTriggerProps,
  PopoverPositionerProps,
} from '@base-ui/react';
import type { JSXElementConstructor } from 'react';

export interface PopoverPropsDef {
  delay?: PopoverTriggerProps['delay'];
  Description: string | JSXElementConstructor<{}>;
  /** If `true`, returns the `Trigger` without the `Popover`. */
  disabled?: boolean;
  side?: PopoverPositionerProps['side'];
  Trigger?: JSXElementConstructor<{}>;
}
