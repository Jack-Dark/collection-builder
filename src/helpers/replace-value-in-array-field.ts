import type { AnyFieldApi } from '@tanstack/react-form';

// ? This function was created to replace the now missing arrayField.replaceValue helper function during the initial release of the form v2 alpha
export const replaceValueInArrayField = <TArrayField extends AnyFieldApi>(
  field: TArrayField,
  index: number,
  data: TArrayField['value'][number],
) => {
  field.removeValue(index);
  field.insertValue(index, data);
};
