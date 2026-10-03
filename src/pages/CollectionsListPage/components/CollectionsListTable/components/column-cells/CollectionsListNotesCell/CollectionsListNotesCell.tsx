import { useSelector } from '@tanstack/react-form';

import type { CreateOrUpdateCollectionFormTypeDef } from '#/pages/CollectionsListPage/CollectionsListPage.types';

import { TextAreaField } from '#/components/Fields/TextAreaField';
import { useEditingCollectionsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

export const CollectionsListNotesCell = (props: {
  form: CreateOrUpdateCollectionFormTypeDef;
  index: number;
  rowId: string;
  value: string;
}) => {
  const { form, index, rowId, value } = props;

  const { getIsEditingRowId } = useEditingCollectionsRowIds();
  const isEditingRow = getIsEditingRowId(rowId);

  const notesValue = useSelector(form.atom, ({ values }) => {
    return values.records[index]?.notes;
  });

  return isEditingRow ? (
    <form.ArrayField name="records">
      {() => {
        return (
          <form.Field name={`records[${index}].notes`}>
            {({ handleChange, name }) => {
              return (
                <TextAreaField
                  // error={getFieldError(field)}
                  name={name}
                  onValueChange={(value) => {
                    handleChange(value);
                  }}
                  placeholder="Input notes..."
                  value={notesValue}
                />
              );
            }}
          </form.Field>
        );
      }}
    </form.ArrayField>
  ) : (
    <p>{value || '-'}</p>
  );
};
