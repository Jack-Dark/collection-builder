import { useSelector } from '@tanstack/react-store';

import type { CreateOrUpdateCollectionItemFormTypeDef } from '#/pages/CollectionDetailsPage/CollectionDetailsPage.types';

export const useSubscribeToCustomFieldValue = (props: {
  customFieldId: number;
  form: CreateOrUpdateCollectionItemFormTypeDef;
  rowIndex: number;
}) => {
  const { customFieldId, form, rowIndex } = props;

  const customFieldValue = useSelector(form.atom, ({ values }) => {
    return values.collectionItems[rowIndex].customFieldValues[customFieldId];
  });

  if (customFieldValue) {
    const { id, valueBoolean, valueNumber, valueText } = customFieldValue;

    // ? force type as hook is used in components where each type is handled
    return {
      id,
      valueBoolean,
      valueNumber,
      valueText,
    };
  } else {
    return;
  }
};
