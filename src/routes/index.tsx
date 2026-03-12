import { createFileRoute } from '@tanstack/react-router';
import { apiRoutes } from '#/api/routes';

const Home = () => {
  const users = Route.useLoaderData();
  console.log('🚀 ~ Home ~ users:', users);

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

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => {
    return apiRoutes.users.getAll();
  },
});
