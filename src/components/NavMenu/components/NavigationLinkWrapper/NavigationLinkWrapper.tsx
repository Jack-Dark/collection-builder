import type { NavigationMenuLinkProps } from '@base-ui/react';

import { NavigationMenu } from '@base-ui/react';
import { Link } from '@tanstack/react-router';
import { twJoin } from 'tailwind-merge';

export const NavigationLinkWrapper = (
  props: NavigationMenuLinkProps & { className?: string },
) => {
  const { className, href, ...navigationLinkProps } = props;
  const isExternal = /^https?:\/\//.test(href!);

  return (
    <NavigationMenu.Link
      {...navigationLinkProps}
      className={twJoin(className, 'flex px-3 py-2')}
      closeOnClick
      href={href}
      render={
        isExternal
          ? undefined
          : ({ href, ...rest }) => {
              return <Link to={href} {...rest} />;
            }
      }
      target={isExternal ? '_blank' : '_self'}
    />
  );
};
