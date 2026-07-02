import type {
  PopoverTriggerProps,
  PopoverPositionerProps,
} from '@base-ui/react';
import type { JSXElementConstructor } from 'react';

export interface PopoverPropsDef {
  delay?: PopoverTriggerProps['delay'];
  Description: string | JSXElementConstructor<{}>;
  side?: PopoverPositionerProps['side'];
  Trigger?: JSXElementConstructor<{}>;
}
