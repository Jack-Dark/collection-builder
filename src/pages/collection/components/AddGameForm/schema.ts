import * as zod from 'zod';

export const addGameFormSchema = zod.object({
  editionDetails: zod.string().describe('Edition details'),
  isSpecialEdition: zod.boolean().describe('Is special edition'),
  name: zod.string().describe('Name').min(1),
  system: zod.string().describe('System').min(1),
});

export const defaultValues: AddGameFormSchemaDef = {
  editionDetails: '',
  isSpecialEdition: false,
  name: '',
  system: '',
};

type AddGameFormSchemaDef = zod.Infer<typeof addGameFormSchema>;
