export const getCursorClassName = (
  disabled: boolean | undefined,
  options: { disabledClassName?: string; enabledClassName?: string } = {},
) => {
  const {
    disabledClassName = 'cursor-not-allowed',
    enabledClassName = 'cursor-pointer',
  } = options;

  return disabled ? disabledClassName : enabledClassName;
};
