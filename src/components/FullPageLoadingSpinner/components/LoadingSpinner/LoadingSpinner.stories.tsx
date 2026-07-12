import type { Meta, StoryObj } from '@storybook/tanstack-react';

import { LoadingSpinner } from '.';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
  args: {},
  // More on argTypes: https://storybook.js.org/docs/api/arg-types#argtypes
  argTypes: {
    variant: {
      control: 'radio',
      options: ['color', 'light', 'dark'],
    },
  },
  component: (props) => {
    const { variant } = props;

    return (
      <div
        className={`size-100 flex items-center justify-center ${variant === 'dark' ? '' : 'bg-gray-600'}`}
        data-loading-overlay=""
      >
        <LoadingSpinner {...props} />
      </div>
    );
  },
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  title: 'Example/LoadingSpinner',
} satisfies Meta<typeof LoadingSpinner>;

export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const LoadingSpinnerStory: Story = {
  args: {
    border: 'border-2',
    enableShadow: false,
    size: 'size-5',
    variant: 'light',
  },
};
