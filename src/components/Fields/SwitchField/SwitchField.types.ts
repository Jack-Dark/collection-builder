import type { SwitchRootProps } from '@base-ui/react';

import type { FieldWrapperProps } from '../FieldWrapper/FieldWrapper.types';

export type SwitchFieldPropsDef = Pick<
  SwitchRootProps,
  'checked' | 'onCheckedChange'
> &
  FieldWrapperProps & {
    labelPosition?: 'left' | 'right';
  };
