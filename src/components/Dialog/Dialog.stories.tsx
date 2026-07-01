import type { Meta, StoryObj } from '@storybook/tanstack-react';

import type { DialogPropsDef } from '#/components/Dialog';

import { Button } from '#/components/Button';
import { Dialog } from '#/components/Dialog';

import { DialogProvider } from './Dialog.Provider';
import { useDialog } from './hooks/useDialog';

const MockedDialogToggle = (props: Partial<DialogPropsDef>) => {
  const [openDialog, hideDialog] = useDialog(() => {
    const content = new Array(100).fill(null).map((_value, index) => {
      return <p key={index}>Dialog content here...</p>;
    });

    return (
      <Dialog
        {...props}
        Footer={() => {
          return (
            <>
              <Button onClick={hideDialog} text="Cancel" variant="secondary" />
              <Button onClick={hideDialog} text="Save" />
            </>
          );
        }}
      >
        {content}
      </Dialog>
    );
  }, []);

  return <Button onClick={openDialog} text="Open Dialog" />;
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
  args: {
    Footer: () => {
      return <p>Footer</p>;
    },
    Header: 'Dialog Title',
    hideClose: false,
    isFullScreen: false,
  },
  // More on argTypes: https://storybook.js.org/docs/api/arg-types#argtypes
  argTypes: {
    Header: {
      description:
        'Accepts a `string` (renders as `h2`) or `JSX` component constructor',
    },
  },
  component: MockedDialogToggle,
  parameters: {
    docs: {
      description: {
        component:
          '[NOTE] Should only be called by passing into the `useDialog` hook!',
      },
    },
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  title: 'Example/Dialog',
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Example: Story = {
  args: {},
  decorators: [
    (Story) => {
      return (
        <DialogProvider>
          <Story />
        </DialogProvider>
      );
    },
  ],
};

export const FullScreen: Story = {
  args: {
    isFullScreen: true,
  },
  decorators: [
    (Story) => {
      return (
        <DialogProvider>
          <Story />
        </DialogProvider>
      );
    },
  ],
};
