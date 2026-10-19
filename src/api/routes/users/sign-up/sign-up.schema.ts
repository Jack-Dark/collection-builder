import z from 'zod';

const minPasswordLength = 8;
const maxPasswordLength = 20;
const minLengthErrorMessage = `Must contain at least ${minPasswordLength} characters`;
const maxLengthErrorMessage = `Must contain no more than ${maxPasswordLength} characters`;
const uppercaseErrorMessage = 'Must contain at least 1 upper case letter';
const lowercaseErrorMessage = 'Must contain at least 1 lower case letter';
const numberErrorMessage = 'Must contain at least 1 number';
const specialCharacters = '!@#$%^&*';
const specialCharacterErrorMessage = `Must contain at least 1 special character (${specialCharacters})`;

export const passwordMismatchErrorMessage = 'Passwords do not match!';

export const passwordSchema = z
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

export const signUpRequestSchema = z.object({
  email: z.email().min(1),
  name: z.string().min(1),
  password: passwordSchema,
  callbackURL: z.string().optional(),
});

export const signUpFormSchema = signUpRequestSchema
  .extend({
    confirmPassword: passwordSchema,
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
