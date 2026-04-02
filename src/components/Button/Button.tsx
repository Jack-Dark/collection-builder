import type { ButtonProps as MuiButtonProps } from '@base-ui/react';

import { Button as MuiButton } from '@base-ui/react';
// import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import CircularProgress from '@mui/material/CircularProgress';
import { useMemo } from 'react';

type ButtonProps = MuiButtonProps & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'alert';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2x';
  processing?: boolean;
};

export const Button = ({
  children,
  className,
  disabled,
  processing,
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...rest
}: ButtonProps) => {
  const classNameString = useMemo(() => {
    const prefix = 'btn';

    return [
      prefix,
      `${prefix}-${size}`,
      `${prefix}-${variant}`,
      'flex items-center justify-center gap-2',
      className,
    ]
      .filter(Boolean)
      .join(' ');
  }, [className, size, variant]);

  return (
    <MuiButton
      disabled={disabled || processing}
      {...rest}
      className={classNameString}
      type={type}
    >
      {processing && (
        <CircularProgress color="inherit" enableTrackSlot size="1rem" />
      )}
      {children}
    </MuiButton>
  );
};
