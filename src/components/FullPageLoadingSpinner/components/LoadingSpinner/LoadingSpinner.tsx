import type { LoadingSpinnerPropsDef } from './LoadingSpinner.types';

export const LoadingSpinner = (props: LoadingSpinnerPropsDef) => {
  const {
    border = 'border-2',
    enableShadow,
    size = 'size-5',
    variant = 'mono',
  } = props;

  const borderColorClasses =
    variant === 'color'
      ? 'border-white border-t-primary-600'
      : variant === 'light'
        ? 'border-white border-t-[rgba(255,255,255,0.4)]'
        : 'border-gray-500 border-t-[rgba(0,0,0,0.1)]';

  return (
    <div
      aria-label="Loading…"
      className={`${size} ${borderColorClasses} ${border} rounded-full animate-spin ${enableShadow ? 'shadow-[0_0_5px_rgba(0,0,0,0.25)]' : ''}`}
      role="status"
    />
  );
};
