import { Route as RootRoute } from '#/routes/__root';

export const useUserContext = () => {
  const { user } = RootRoute.useRouteContext();

  return user
    ? {
        email: user.email,
        emailVerified: user.emailVerified,
        id: user.id,
        impersonatedBy: user.impersonatedBy,
        name: user.name,
        role: user.role,
      }
    : undefined;
};
