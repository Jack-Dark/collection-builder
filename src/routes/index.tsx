import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { createUser, getAllUsers } from '#/db/queries/users';

const fetchAllUsers = createServerFn({
  method: 'GET',
}).handler(() => {
  return getAllUsers();
});

const createNewUser = createServerFn({
  method: 'POST',
}).handler(() => {
  return createUser({
    email: 'test@test.com',
    firstName: 'Foo',
    lastName: 'Bar',
  });
});

const Home = () => {
  const users = Route.useLoaderData();
  console.log('🚀 ~ Home ~ users:', users);

  return (
    <button
      onClick={async () => {
        await createNewUser();
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
    return fetchAllUsers();
  },
});
