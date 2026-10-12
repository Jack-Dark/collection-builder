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
            {({ errors, handleChange, name }) => {
              return (
                <InputField
                  autoFocus
                  error={errors}
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
      className="flex items-center size-full text-theme-t1 text-foo hover:text-theme-link-hover hover:*:data-arrow-icon:opacity-100"
      params={{ id: rowId }}
      to="/collections/$id"
    >
      <p className="text-inherit">{value}</p>
      <KeyboardArrowRightIcon
        className="opacity-0 text-inherit"
        data-arrow-icon=""
      />
    </Link>
  );
};
