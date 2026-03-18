import type { NavigationMenuLinkProps } from '@base-ui/react';
import type { AnchorHTMLAttributes } from 'react';

import { NavigationMenu } from '@base-ui/react';
import { Link } from '@tanstack/react-router';

export const NavigationLinkWrapper = (props: NavigationMenuLinkProps) => {
  return (
    <NavigationMenu.Link
      render={({ href, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
        const isExternal = /^https?:\/\//.test(href!);

        return isExternal ? (
          <a {...rest} href={href} />
        ) : (
          <Link {...rest} to={href} />
        );
      }}
      {...props}
    />
  );
};
