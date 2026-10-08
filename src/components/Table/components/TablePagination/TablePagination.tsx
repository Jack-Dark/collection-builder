import { SelectField } from '#/components/Fields/SelectField';

import type { TablePaginationPropsDef } from './TablePagination.types';

export const TablePagination = (props: {
  pagination: TablePaginationPropsDef;
}) => {
  const { pagination } = props;

  return (
    <div className="flex gap-4 items-center justify-end">
      {pagination.limit && (
        <SelectField
          idProperty="value"
          items={[50, 100, 150, 200, 250].map((value) => {
            return { label: value, value };
          })}
          keyPrefix="limit"
          onValueChange={(item) => {
            if (item?.value) {
              pagination?.limit?.onChange?.(item.value);
            }
          }}
          RenderValue={({ item }) => {
            return <span>Per page: {item.label}</span>;
          }}
          value={{
            label: pagination.limit.value,
            value: pagination.limit.value,
          }}
        />
      )}

      {pagination.page && (
        <SelectField
          idProperty="value"
          items={new Array(pagination.page.max).fill(null).map((_, index) => {
            const value = index + 1;

            return {
              label: value,
              value,
            };
          })}
          keyPrefix="page"
          onValueChange={(item) => {
            if (item?.value) {
              pagination?.page?.onChange?.(item.value);
            }
          }}
          RenderValue={({ item }) => {
            return <span>Page: {item.label}</span>;
          }}
          value={{
            label: pagination.page.value,
            value: pagination.page.value,
          }}
        />
      )}
    </div>
  );
};
