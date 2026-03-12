import { createFileRoute } from '@tanstack/react-router';
import { apiRoutes } from '#/api/routes';

const Home = () => {
  const users = Route.useLoaderData();
  console.log('🚀 ~ Home ~ users:', users);

  return (
    <button
      onClick={async () => {
        await apiRoutes.users.create();
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
