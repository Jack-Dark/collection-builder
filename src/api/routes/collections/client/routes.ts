import { createNewCollection } from '#/routes/api/collections/route';
import * as zod from 'zod';

import type {
  CollectionRecordDef,
  NewCollectionRecordDef,
  UpdateCollectionRecordDef,
} from '../server/types';

export const createSchema = zod.object({
  name: zod.string().describe('Name').min(1),
});

const baseApiPath = '/api/collections';

export const create = async (game: NewCollectionRecordDef) => {
  try {
    return await createNewCollection({ data: game });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};

export const updateById = async (
  id: number,
  gameDetails: UpdateCollectionRecordDef,
) => {
  const url = `${baseApiPath}/${id}`;
  try {
    const response = await fetch(url, {
      body: JSON.stringify(gameDetails),
      method: 'PUT',
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result: CollectionRecordDef = await response.json();

    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};

export const deleteById = async (id: number) => {
  const url = `${baseApiPath}/${id}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};

export const getById = async (id: number) => {
  const url = `${baseApiPath}/${id}`;
  try {
    const response = await fetch(url, { method: 'GET' });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result: CollectionRecordDef = await response.json();

    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};
