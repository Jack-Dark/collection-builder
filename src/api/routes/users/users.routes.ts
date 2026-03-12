import { createServerFn } from '@tanstack/react-start';
import { createUser, getAllUsers } from '#/api/routes/users/users.queries';

export const getAll = createServerFn({
  method: 'GET',
}).handler(() => {
  return getAllUsers();
});

export const create = createServerFn({
  method: 'POST',
}).handler(() => {
  return createUser({
    email: 'test@test.com',
    firstName: 'Foo',
    lastName: 'Bar',
  });
});
