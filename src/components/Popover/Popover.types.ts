import type {
  PopoverTriggerProps,
  PopoverPositionerProps,
} from '@base-ui/react';
import type { JSXElementConstructor } from 'react';

export type PopoverPropsDef = {
  Description: string | JSXElementConstructor<{}>;
  /** If `true`, returns the `Trigger` without the `Popover`. */
  disabled?: boolean;
  isTriggerButton?: boolean;
  side?: PopoverPositionerProps['side'];
  Trigger?: JSXElementConstructor<{}>;
} & Pick<PopoverTriggerProps, 'delay'>;
