import type { FC, PropsWithChildren } from 'react';

import { memo } from 'react';

import type { DialogComponentDef } from './Dialog.Context';

type DialogRootProps = {
  dialogs: Record<string, DialogComponentDef>;
};

type DialogRendererPropsDef = {
  component: DialogComponentDef;
};

const DialogRenderer = memo(
  ({ component, ...rest }: DialogRendererPropsDef) => {
    return component(rest);
  },
);

export const DialogRoot: FC<PropsWithChildren<DialogRootProps>> = (props) => {
  const { dialogs } = props;

  return (
    <>
      {Object.keys(dialogs).map((key: string) => {
        return <DialogRenderer component={dialogs[key]} key={key} />;
      })}
    </>
  );
};
