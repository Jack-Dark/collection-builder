import type { AnyFormApi } from '@tanstack/react-form';

import { useSelector } from '@tanstack/react-store';

import type { CustomFieldValueDef } from '#/api/routes/custom-field-values/custom-field-values.types';

export const useSubscribeToCustomFieldValue = <
  TValue extends CustomFieldValueDef,
  TForm extends AnyFormApi,
>(props: {
  customFieldId: number;
  form: TForm;
  rowIndex: number;
}) => {
  const { customFieldId, form, rowIndex } = props;

  const customFieldValue = useSelector(form.atom, ({ values }) => {
    return values.collectionItems[rowIndex].customFieldValues[customFieldId];
  });

  if (customFieldValue) {
    const { data, id } = customFieldValue;

    // ? force type as hook is used in components where each type is handled
    return {
      data: {
        value: data.value as TValue,
      },
      id: id as number,
    };
  } else {
    return;
  }
};
