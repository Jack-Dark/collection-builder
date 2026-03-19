import type * as zodTypes from 'zod';

import { passwordSchema } from '#/pages/SignUpPage/components/SignUpForm/SignUpForm.schema';
import * as zod from 'zod';

export const defaultValues: SignUpFormSchemaDef = {
  email: '',
  password: '',
};

export const signInFormSchema = zod.object({
  email: zod.email().describe('Email').min(1),
  password: passwordSchema,
});

type SignUpFormSchemaDef = zodTypes.Infer<typeof signInFormSchema>;
