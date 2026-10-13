import type { Meta, ReactRenderer, StoryObj } from '@storybook/tanstack-react';
import type { DecoratorFunction } from 'storybook/internal/csf';

import { useLayoutEffect } from 'react';

import type { DialogPropsDef } from '#/components/Dialog';

import { Button } from '#/components/Button';
import { Dialog as DialogComponent } from '#/components/Dialog';

import { useDialog } from './hooks/useDialog';

const MockContent = (props: { lines: number }) => {
  const { lines } = props;

  return (
    <>
      {new Array(lines).fill(null).map((_value, index) => {
        return (
          <p key={index}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        );
      })}
    </>
  );
};

const ToggleDecorator: DecoratorFunction<ReactRenderer, DialogPropsDef> = (
  Component,
  context,
) => {
  const isStoryView = /story/i.test(context.viewMode);
  const { children, hideClose, onClose: _onClose, ...rest } = context.args;

  const [openDialog, hideDialog] = useDialog(() => {
    const closeProps = hideClose
      ? {
          hideClose,
        }
      : {
          onClose: hideDialog,
        };

    return (
      <Component
        {...rest}
        {...closeProps}
        Footer={() => {
          return (
            <>
              <Button onClick={hideDialog} text="Cancel" variant="mono" />
              <Button onClick={hideDialog} text="Save" />
            </>
          );
        }}
      >
        {children}
      </Component>
    );
  }, []);

  useLayoutEffect(() => {
    if (isStoryView) {
      openDialog();
    }
  }, []);

  return (
    <Button
      disabled={!isStoryView}
      onClick={openDialog}
      text={isStoryView ? 'Open Dialog' : 'Disabled in Docs view'}
    />
  );
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
  component: DialogComponent,
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
  title: 'Dialog',
} satisfies Meta<typeof DialogComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Dialog: Story = {
  args: {
    children: <MockContent lines={1} />,
  },
  decorators: [
    ToggleDecorator,
  ] as unknown as [] /* https://github.com/storybookjs/storybook/issues/25492 */,
};

export const ScrollableDialog: Story = {
  args: {
    children: <MockContent lines={10} />,
  },
  decorators: [
    ToggleDecorator,
  ] as unknown as [] /* https://github.com/storybookjs/storybook/issues/25492 */,
};

export const FullScreenDialog: Story = {
  args: {
    children: <MockContent lines={20} />,
    isFullScreen: true,
  },
  decorators: [
    ToggleDecorator,
  ] as unknown as [] /* https://github.com/storybookjs/storybook/issues/25492 */,
};
