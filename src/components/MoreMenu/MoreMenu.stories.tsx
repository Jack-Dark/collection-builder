import type { Meta, StoryObj } from '@storybook/tanstack-react';

import { MoreMenu } from '#/components/MoreMenu';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
  args: {
    items: [
      {
        href: '/',
        label: 'Link',
      },
      {
        label: 'On click',
        onClick: () => {
          alert('You clicked on "Delete".');
        },
      },
      {
        addSeparator: true,
        disabled: true,
        label: 'Disabled',
        onClick: () => {
          alert('You clicked on "Disabled".');
        },
      },
      {
        href: '/',
        label: 'Sub-menu',
        subMenu: {
          items: [
            {
              href: '/',
              label: 'Sub-menu 1',
            },
            {
              href: '/',
              label: 'Sub-menu 2',
            },
            {
              href: '/',
              label: 'Sub-menu 3',
            },
          ],
        },
      },
    ],
  },
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  component: MoreMenu,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  title: 'Example/MoreMenu',
} satisfies Meta<typeof MoreMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Example: Story = {
  args: {},
};

export const ForcedOpen: Story = {
  args: {
    open: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
