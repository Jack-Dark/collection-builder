import { eq, and } from 'drizzle-orm';
import _ from 'lodash';

import type { CustomFieldTypeDef } from '#/api/db-tables-schema.types';
import type { DbQueryArgsDef } from '#/auth/auth-middleware.types';

import { db } from '#/api/db';
import {
  customFieldsTable,
  customFieldValuesTable,
} from '#/api/db-tables-schema';

import type { GetFiltersForCollectionRequestArgsDef } from './get-filters-for-collection.types';

export const getFiltersForCollectionDbQuery = async ({
  context,
  data,
}: DbQueryArgsDef<GetFiltersForCollectionRequestArgsDef>) => {
  const { id: collectionId } = data;

  const userId = context.user.id;

  return db.transaction(async (tx) => {
    const collection = await tx.query.collections.findFirst({
      where: {
        id: collectionId,
        userId,
      },
      with: {
        customFields: {
          columns: {},
          orderBy: {
            order: 'asc',
          },
          with: {
            customField: {
              columns: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        },
      },
    });

    if (!collection) {
      return [];
    }

    type CustomFieldData<TType extends CustomFieldTypeDef> = Omit<
      NonNullable<(typeof collection.customFields)[number]['customField']>,
      'type'
    > & { type: TType };

    const customFieldsInCollection = collection.customFields.reduce<
      CustomFieldData<CustomFieldTypeDef>[]
    >((acc, { customField }) => {
      if (customField) {
        return [...acc, customField];
      } else {
        return acc;
      }
    }, []);

    // return customFieldsInCollection;

    const uniqueCustomFieldValues = await Promise.all(
      customFieldsInCollection.map(async (customField) => {
        if (customField) {
          return await tx
            .selectDistinctOn([customFieldValuesTable.id], {
              data: customFieldValuesTable.data,
            })
            .from(customFieldValuesTable)
            .innerJoin(
              customFieldsTable,
              eq(customFieldsTable.id, customField.id),
            )
            .where(
              and(
                eq(customFieldsTable.userId, userId),
                eq(customFieldValuesTable.customFieldId, customField.id),
                eq(customFieldValuesTable.userId, userId),
              ),
            );
        } else {
          return;
        }
      }),
    );

    const formattedResponse = customFieldsInCollection.reduce<
      (
        | (CustomFieldData<'string'> & {
            items: {
              label: string;
              value: string;
            }[];
            range?: undefined;
          })
        | (CustomFieldData<'number'> & {
            items?: undefined;
            range: {
              max: number;
              min: number;
            };
          })
        | (CustomFieldData<'boolean'> & {
            items?: undefined;
            range?: undefined;
          })
      )[]
    >((acc, customField, index) => {
      if (customField.type === 'string') {
        const matchingCustomFieldValues = uniqueCustomFieldValues[index];

        if (matchingCustomFieldValues) {
          const values = matchingCustomFieldValues.map(({ data }) => {
            const value = data.value as string;

            return {
              label: value,
              value,
            };
          });

          const sortedValues = _.sortBy(values, ({ label }) => {
            return label.toLocaleLowerCase();
          });

          return [
            ...acc,
            {
              ...customField,
              items: sortedValues,
              type: customField.type,
            },
          ];
        }

        return acc;
      } else if (customField.type === 'number') {
        const matchingCustomFieldValues = uniqueCustomFieldValues[index];

        if (matchingCustomFieldValues) {
          const values = matchingCustomFieldValues.map(({ data }) => {
            return data.value as number;
          });

          const min = Math.min(...values);
          const max = Math.max(...values);

          return [
            ...acc,
            {
              ...customField,
              range: {
                max,
                min,
              },
              type: customField.type,
            },
          ];
        }

        return acc;
      } else {
        return [
          ...acc,
          {
            ...customField,
            type: customField.type,
          },
        ];
      }
    }, []);

    return formattedResponse;
  });
};
