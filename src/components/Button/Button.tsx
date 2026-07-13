import type { ButtonProps as MuiButtonProps } from '@base-ui/react';
import type { JSXElementConstructor } from 'react';

import { Button as MuiButton } from '@base-ui/react';

import { LoadingSpinner } from '../FullPageLoadingSpinner/components/LoadingSpinner';

type ButtonProps = MuiButtonProps & {
  disabled?: boolean;
  Icon?: JSXElementConstructor<{}>;
  iconPosition?: (typeof iconPositions)[keyof typeof iconPositions];
  processing?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  text?: string;
  /** Set to `'submit'` for form submission. */
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'mono' | 'ghost' | 'alert';
};

const iconPositions = {
  left: 'left',
  right: 'right',
} as const;

export const Button = ({
  children,
  className = '',
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
  return (
    <MuiButton
      disabled={disabled || processing}
      {...rest}
      className={`btn btn-${size} btn-${variant} flex items-center justify-center gap-2 ${className}`}
      type={type}
    >
      {iconPosition === iconPositions.left &&
        (processing ? <LoadingSpinner /> : Icon && <Icon />)}

      {children ? children : text && <p>{text}</p>}

      {iconPosition === iconPositions.right &&
        (processing ? <LoadingSpinner /> : Icon && <Icon />)}
    </MuiButton>
  );
};
