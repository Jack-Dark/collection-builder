import type { Meta, StoryObj } from '@storybook/tanstack-react';

import { Notifications } from '#/components/Notifications';

import { Button } from '../Button';
import { useNotifications } from './useNotifications';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
  args: {},
  // More on argTypes: https://storybook.js.org/docs/api/arg-types#argtypes
  argTypes: {},
  component: () => {
    const { notify, notifyError, notifyWarning } = useNotifications();

    return (
      <div className="w-200">
        <Notifications />

        <div className="pt-40 flex gap-4 justify-center">
          <Button
            onClick={() => {
              notify('Success notification example.');
            }}
          >
            Toggle Success
          </Button>
          <Button
            onClick={() => {
              notifyWarning('Warning notification example.');
            }}
            variant="mono"
          >
            Toggle Warning
          </Button>
          <Button
            onClick={() => {
              notifyError('Error notification example.');
            }}
            variant="alert"
          >
            Toggle Error
          </Button>
        </div>
      </div>
    );
  },
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  title: 'Example/Notification',
} satisfies Meta<typeof Notifications>;

export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const NotificationToggles: Story = {
  args: {},
};
