import { faker } from '@faker-js/faker';
import { systemsList } from '#/pages/CollectionItemsPage/components/AddGameForm/constants';

import type { NewGameRecordDef } from './types';

export const getMockGamesForUser = (userId: string): NewGameRecordDef[] => {
  const createRandomUser = () => {
    const isSpecialEdition = faker.datatype.boolean(0.2);

    return {
      editionDetails: isSpecialEdition ? "Collector's Edition" : null,
      isSpecialEdition,
      name: faker.book.title(),
      system: faker.helpers.arrayElement(Object.values(systemsList)),
      userId,
    };
  };
  const mockGames = faker.helpers.multiple(createRandomUser, {
    count: 50,
  });

  return mockGames;
};
