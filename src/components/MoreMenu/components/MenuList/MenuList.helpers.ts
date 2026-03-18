export const getMenuItemClasses = (disabled: boolean | undefined) => {
  return [
    `flex cursor-default py-2 pr-8 pl-4 text-sm leading-4 outline-hidden select-none`,
    'data-[clickable]:cursor-pointer',
    'data-[group-label]:text-gray-500',
    disabled
      ? 'data-[disabled]:cursor-not-allowed data-[disabled]:text-gray-300'
      : 'data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-xs data-[highlighted]:before:bg-menu-primary-hover',
  ]
    .filter(Boolean)
    .join(' ');
};
