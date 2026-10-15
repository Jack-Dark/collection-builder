import type { ButtonProps as MuiButtonProps } from '@base-ui/react';
import type { JSXElementConstructor, ReactElement } from 'react';

import { Button as MuiButton } from '@base-ui/react';
import { twMerge } from 'tailwind-merge';

import { LoadingSpinner } from '../FullPageLoadingSpinner/components/LoadingSpinner';

export const buttonVariants = [
  'primary',
  'secondary',
  'mono',
  'ghost',
  'alert',
] as const;

export type ButtonVariant = (typeof buttonVariants)[number];

type ButtonProps = MuiButtonProps & {
  className?: string;
  disabled?: boolean;
  iconPosition?: (typeof iconPositions)[keyof typeof iconPositions];
  processing?: boolean;
  /** Applies standardized padding, font-size, and line-height styling. `'custom'` does not apply any. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'custom';
  /** Set to `'submit'` for form submission. */
  type?: 'button' | 'submit';
  variant?: ButtonVariant;
} & (
    | {
        'aria-label'?: string;
        children?: never;
        Icon?: JSXElementConstructor<{}>;
        text: string;
      }
    | {
        'aria-label'?: string;
        children: ReactElement;
        Icon?: JSXElementConstructor<{}>;
        text?: never;
      }
    | {
        'aria-label': string;
        children?: never;
        Icon: JSXElementConstructor<{}>;
        text?: never;
      }
  );

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
      className={twMerge(
        `btn btn-${size} btn-${variant} flex items-center justify-center gap-2`,
        className,
      )}
      type={type}
    >
      {iconPosition === iconPositions.left &&
        (processing ? <LoadingSpinner /> : Icon && <Icon />)}

      {children || text}

      {iconPosition === iconPositions.right &&
        (processing ? <LoadingSpinner /> : Icon && <Icon />)}
    </MuiButton>
  );
};
