import { useLoaderData } from '@tanstack/react-router';
import { apiRoutes } from '#/api/routes';

export const Home = () => {
  const users = useLoaderData({ from: '/' });

  return (
    <button
      onClick={async () => {
        // TODO - REPLACE WITH ACTUAL AUTHENTICATION
        // TODO - BETTER AUTH? CLERK?
        await apiRoutes.users.create({
          data: {
            email: 'test@test.com',
            firstName: 'Foo',
            hashedPassword: 'unset',
            lastName: 'Bar',
          },
        });
      }}
      type="button"
    >
      Create User
    </button>
  );
};
