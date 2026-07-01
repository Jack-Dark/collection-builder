import type { ButtonProps as MuiButtonProps } from '@base-ui/react';
import type { JSXElementConstructor } from 'react';

import { Button as MuiButton } from '@base-ui/react';
import CircularProgress from '@mui/material/CircularProgress';
import { useMemo } from 'react';

type ButtonProps = MuiButtonProps & {
  disabled?: boolean;
  Icon?: JSXElementConstructor<{}>;
  iconPosition?: (typeof iconPositions)[keyof typeof iconPositions];
  processing?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  text?: string;
  /** Set to `'submit'` for form submission. */
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'ghost' | 'alert';
};

const iconPositions = {
  left: 'left',
  right: 'right',
} as const;

export const Button = ({
  children,
  className,
  disabled = false,
  Icon,
  iconPosition = iconPositions.left,
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
      {iconPosition === iconPositions.left &&
        (processing ? (
          <CircularProgress color="inherit" enableTrackSlot size="1rem" />
        ) : (
          Icon && <Icon />
        ))}

      {children ? children : <p>{text}</p>}

      {iconPosition === iconPositions.right &&
        (processing ? (
          <CircularProgress color="inherit" enableTrackSlot size="1rem" />
        ) : (
          Icon && <Icon />
        ))}
    </MuiButton>
  );
};
