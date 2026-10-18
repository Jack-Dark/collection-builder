import { formOptions } from '@tanstack/react-form';
import { createAtom, useAtom } from '@tanstack/react-store';
import { v4 as uuidv4 } from 'uuid';

import type { CreateCollectionItemsFormDataSchemaDef } from '#/api/routes/collection-items/create-collection-item/create-collection-item.types';
import type { CustomFieldValuesByFieldId } from '#/api/routes/custom-field-values/custom-field-values.types';

import { useGetCollectionDetailsById } from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.react-query';
import { Route as CollectionDetailsRoute } from '#/routes/_protected/collections/$id';

import type { CreateOrUpdateCollectionItemFormDataDef } from './CollectionDetailsPage.types';

import { createOrUpdateCollectionItemsFormSchema } from './CollectionDetailsPage.schema';

export const useCreateNewCollectionItem =
  (): (() => CreateCollectionItemsFormDataSchemaDef) => {
    const { id } = CollectionDetailsRoute.useParams();
    const collectionId = Number(id);

    const { autoPopulateCustomFieldValues, lastAddedCustomFieldValues } =
      useLastAddedCustomFieldValues();

    return () => {
      return {
        collectionId,
        customFieldValues: autoPopulateCustomFieldValues
          ? lastAddedCustomFieldValues
          : {},
        editionDetails: '',
        id: uuidv4(),
        images: [],
        isSpecialEdition: Boolean(),
        name: '',
        notes: '',
      };
    };
  };

const autoPopulateCustomFieldValuesAtom =
  createAtom<CustomFieldValuesByFieldId>({});

export const useLastAddedCustomFieldValues = () => {
  const [lastAddedCustomFieldValues, setLastAddedCustomFieldValues] = useAtom(
    autoPopulateCustomFieldValuesAtom,
  );

  const { id } = CollectionDetailsRoute.useParams();
  const searchQueries = CollectionDetailsRoute.useSearch();

  const { autoPopulateCustomFieldValues } =
    CollectionDetailsRoute.useLoaderData();

  const collectionId = Number(id);

  const updateLastAddedCustomFieldValues = (
    partialCustomFieldValuesByCustomFieldId: CustomFieldValuesByFieldId,
  ) => {
    if (autoPopulateCustomFieldValues) {
      setLastAddedCustomFieldValues((prev) => {
        return { ...prev, ...partialCustomFieldValuesByCustomFieldId };
      });
    }
  };

  useGetCollectionDetailsById({
    onSuccess: (data) => {
      if (autoPopulateCustomFieldValues) {
        setLastAddedCustomFieldValues(data.lastAddedCustomFieldValues);
      }
    },
    requestArgs: { collectionId, params: searchQueries },
  });

  return {
    autoPopulateCustomFieldValues,
    lastAddedCustomFieldValues,
    setLastAddedCustomFieldValues,
    updateLastAddedCustomFieldValues,
  };
};

export const createOrUpdateCollectionItemsFormDefaultValues: CreateOrUpdateCollectionItemFormDataDef =
  {
    collectionItems: [],
  };

export const createOrUpdateCollectionItemsFormOptions = formOptions({
  defaultValues: createOrUpdateCollectionItemsFormDefaultValues,
  formId: 'collection-items',
  validators: [
    {
      run: createOrUpdateCollectionItemsFormSchema,
      runOnSubmit: true,
      triggers: [],
    },
  ],
});
