import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Link } from '@tanstack/react-router';

import type { CreateOrUpdateCollectionFormTypeDef } from '#/pages/CollectionsListPage/CollectionsListPage.types';

import { InputField } from '#/components/Fields/InputField';
import { useEditingCollectionsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

export const CollectionsListNameCell = ({
  form,
  rowId,
  rowIndex,
  value,
}: {
  form: CreateOrUpdateCollectionFormTypeDef;
  rowId: string;
  rowIndex: number;
  value: string;
}) => {
  const { getIsEditingRowId } = useEditingCollectionsRowIds();
  const isEditingRow = getIsEditingRowId(rowId);

  return (
    <form.Field name={`records[${rowIndex}].name`}>
      {(field) => {
        return isEditingRow ? (
          <InputField
            autoFocus
            error={field.errors}
            hideLabel
            name={field.name}
            onValueChange={field.handleChange}
            placeholder="Input name..."
            required
            value={field.value}
          />
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
      }}
    </form.Field>
  );
};
