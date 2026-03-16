import type { ButtonProps as MuiButtonProps } from '@base-ui/react';

import { Button as MuiButton } from '@base-ui/react';

export const Button = (props: MuiButtonProps) => {
  return <MuiButton {...props} />;
};
