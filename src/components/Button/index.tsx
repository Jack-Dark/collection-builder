import type { ButtonProps as MuiButtonProps } from '@base-ui/react';

import { Button as MuiButton } from '@base-ui/react';
import { useMemo } from 'react';

type ButtonProps = MuiButtonProps & {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2x';
};

export const Button = ({
  className,
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...rest
}: ButtonProps) => {
  const classNameString = useMemo(() => {
    const prefix = 'btn';

    return [prefix, `${prefix}-${size}`, `${prefix}-${variant}`, className]
      .filter(Boolean)
      .join(' ');
  }, [className, size, variant]);

  return <MuiButton {...rest} className={classNameString} type={type} />;
};
