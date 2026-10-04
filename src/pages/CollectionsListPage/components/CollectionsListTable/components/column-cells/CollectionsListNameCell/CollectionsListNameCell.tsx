import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useSelector } from '@tanstack/react-form';
import { Link } from '@tanstack/react-router';

import type { CreateOrUpdateCollectionFormTypeDef } from '#/pages/CollectionsListPage/CollectionsListPage.types';

import { InputField } from '#/components/Fields/InputField';
import { useEditingCollectionsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

export const CollectionsListNameCell = ({
  form,
  index,
  rowId,
  value,
}: {
  form: CreateOrUpdateCollectionFormTypeDef;
  index: number;
  rowId: string;
  value: string;
}) => {
  const { getIsEditingRowId } = useEditingCollectionsRowIds();
  const isEditingRow = getIsEditingRowId(rowId);

  const nameValue = useSelector(form.atom, ({ values }) => {
    return values.records[index]?.name;
  });

  return isEditingRow ? (
    <form.ArrayField name="records">
      {() => {
        return (
          <form.Field name={`records[${index}].name`}>
            {({ handleChange, name }) => {
              return (
                <InputField
                  autoFocus
                  // error={getFieldError(field)}
                  hideLabel
                  name={name}
                  onValueChange={handleChange}
                  placeholder="Input name..."
                  required
                  value={nameValue}
                />
              );
            }}
          </form.Field>
        );
      }}
    </form.ArrayField>
  ) : (
    <Link
      className="flex items-center size-full hover:text-primary-800 hover:*:data-arrow-icon:opacity-100"
      params={{ id: rowId }}
      to="/collections/$id"
    >
      <p>{value}</p>
      <KeyboardArrowRightIcon
        className="opacity-0 text-inherit"
        data-arrow-icon=""
      />
    </Link>
  );
};
