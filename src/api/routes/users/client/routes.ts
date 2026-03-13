import { createServerFn } from '@tanstack/react-start';
import {
  createUser,
  getAllUsers,
  getUserByEmail,
} from '#/api/routes/users/server/queries';
import * as zod from 'zod';

export const getAll = createServerFn({
  method: 'GET',
}).handler(() => {
  return getAllUsers();
});

export const createSchema = zod.object({
  email: zod.email().describe('Email'),
  firstName: zod.string().describe('First name'),
  hashedPassword: zod.string().describe('Hashed password'),
  lastName: zod.string().describe('Last name'),
});

export const create = createServerFn({
  method: 'POST',
})
  .inputValidator(createSchema)
  .handler(({ data }) => {
    return createUser(data);
  });

const getByEmailSchema = zod.object({ email: zod.email().describe('Email') });

export const getByEmail = createServerFn({
  method: 'GET',
})
  .inputValidator(getByEmailSchema)
  .handler(({ data }) => {
    return getUserByEmail(data.email);
  });
