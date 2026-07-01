import type { ButtonProps as MuiButtonProps } from '@base-ui/react';

import { Button as MuiButton } from '@base-ui/react';
import CircularProgress from '@mui/material/CircularProgress';
import { useMemo } from 'react';

type ButtonProps = MuiButtonProps & {
  disabled?: boolean;
  processing?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  text?: string;
  /** Set to `'submit'` for form submission. */
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'ghost' | 'alert';
};

export const Button = ({
  children,
  className,
  disabled = false,
  processing = false,
  size = 'md',
  text = '',
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
      {text && <p>{text}</p>}
      {children}
    </MuiButton>
  );
};
