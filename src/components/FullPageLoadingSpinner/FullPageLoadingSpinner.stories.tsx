import type { Meta, StoryObj } from '@storybook/tanstack-react';

import { FullPageLoadingSpinner } from '.';
import { Button } from '../Button';
import { useSpinner } from './useSpinner';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
  args: {},
  // More on argTypes: https://storybook.js.org/docs/api/arg-types#argtypes
  argTypes: {},
  component: () => {
    const { showSpinner } = useSpinner();

    return (
      <div className="size-100">
        <FullPageLoadingSpinner />

        <div className="size-full flex justify-center items-center">
          <Button
            onClick={() => {
              showSpinner();
            }}
          >
            Toggle Loading Spinner
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
  title: 'Example/FullPageLoadingSpinner',
} satisfies Meta<typeof FullPageLoadingSpinner>;

export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const FullPageLoadingSpinnerToggles: Story = {
  args: {},
};
