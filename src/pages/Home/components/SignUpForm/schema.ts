import type * as zodTypes from 'zod';

import * as zod from 'zod';

export const defaultValues: SignUpFormSchemaDef = {
  confirmPassword: '',
  email: '',
  name: '',
  password: '',
};

// TODO - ADD TOOLTIP WITH PASSWORD REQUIREMENTS TO FORM
const minPasswordLength = 8;
const maxPasswordLength = 20;
const minLengthErrorMessage = `Must contain at least ${minPasswordLength} characters`;
const maxLengthErrorMessage = `Must contain no more than ${maxPasswordLength} characters`;
const uppercaseErrorMessage = 'Must contain at least 1 upper case letter';
const lowercaseErrorMessage = 'Must contain at least 1 lower case letter';
const numberErrorMessage = 'Must contain at least 1 number';
const specialCharacters = '!@#$%^&*';
const specialCharacterErrorMessage = `Must contain at least 1 special character (${specialCharacters})`;
const passwordMismatchErrorMessage = 'Passwords do not match!';

const passwordSchema = zod
  .string()
  .min(minPasswordLength, { message: minLengthErrorMessage })
  .max(maxPasswordLength, { message: maxLengthErrorMessage })
  .refine(
    (password) => {
      return /[A-Z]/.test(password);
    },
    {
      message: uppercaseErrorMessage,
    },
  )
  .refine(
    (password) => {
      return /[a-z]/.test(password);
    },
    {
      message: lowercaseErrorMessage,
    },
  )
  .refine(
    (password) => {
      return /[0-9]/.test(password);
    },
    {
      message: numberErrorMessage,
    },
  )
  .refine(
    (password) => {
      return /[!@#$%^&*]/.test(password);
    },
    {
      message: specialCharacterErrorMessage,
    },
  );

export const confirmPasswordSchema = zod
  .object({
    confirmPassword: zod.string(),
    password: passwordSchema,
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    {
      message: passwordMismatchErrorMessage,
      path: ['confirmPassword'],
    },
  );

// KEPT THIS FOR FUTURE PASSWORD UPDATE LOGIC
// export const updatePasswordSchema = zod
//   .object({
//     confirmPassword: zod.string(),
//     currentPassword: zod.string(),
//     password: passwordSchema,
//   })
//   .refine(
//     (data) => {
//       return data.password === data.confirmPassword;
//     },
//     {
//       message: passwordMismatchErrorMessage,
//       path: ['confirmPassword'],
//     },
//   );

export const signUpFormSchema = confirmPasswordSchema.extend({
  email: zod.email().describe('Email').min(1),
  name: zod.string().describe('Name').min(1),
});

type SignUpFormSchemaDef = zodTypes.Infer<typeof signUpFormSchema>;
