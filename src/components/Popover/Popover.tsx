import { Popover as MuiPopover } from '@base-ui/react';
import InfoIcon from '@mui/icons-material/Info';

import type { PopoverPropsDef } from './Popover.types';

export const Popover = (props: PopoverPropsDef) => {
  const {
    delay = 100,
    Description = '',
    side = 'top',
    Trigger = () => {
      return <InfoIcon className="text-gray-400" fontSize="small" />;
    },
  } = props;

  return (
    <MuiPopover.Root>
      <MuiPopover.Trigger delay={delay} openOnHover>
        <Trigger />
      </MuiPopover.Trigger>
      <MuiPopover.Portal>
        <MuiPopover.Positioner side={side} sideOffset={8}>
          <MuiPopover.Popup className="relative flex h-[var(--popup-height,auto)] w-[var(--popup-width,auto)] max-w-60 flex-col gap-1 origin-[var(--transform-origin)] px-4 py-2 text-gray-500 bg-white outline-none border border-gray-300 rounded-xs">
            <MuiPopover.Arrow className="relative block w-3 h-1.5 overflow-clip data-[side=bottom]:top-[-6px] data-[side=left]:right-[-9px] data-[side=left]:rotate-90 data-[side=right]:left-[-9px] data-[side=right]:-rotate-90 data-[side=top]:bottom-[-6px] data-[side=top]:rotate-180 before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:w-[calc(6px*sqrt(2))] before:h-[calc(6px*sqrt(2))] before:bg-white  before:border before:border-gray-300  before:[transform:translate(-50%,50%)_rotate(45deg)]" />

            {typeof Description === 'string' ? (
              <MuiPopover.Description className="text-sm">
                {Description}
              </MuiPopover.Description>
            ) : (
              <Description />
            )}
          </MuiPopover.Popup>
        </MuiPopover.Positioner>
      </MuiPopover.Portal>
    </MuiPopover.Root>
  );
};
