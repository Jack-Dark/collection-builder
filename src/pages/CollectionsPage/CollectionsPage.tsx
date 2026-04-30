import type { RouteComponent } from '@tanstack/react-router';

import { create } from 'zustand';

import { Table } from '#/components/Table';
import { PageWrapper } from '#/page-wrapper';
import { Route } from '#/routes/_protected/collections';

import { collectionTableColumns } from './columns';
import { AddCollectionForm } from './components/AddCollectionForm';

/**
 * @example
 *
 * ```tsx
 * const useIsEditingRowIds = getUseIsEditingRowIds<string>();
 *
 * const ExampleComponent = ({ id }: { id: string }) => {
 *   const { addToIsEditingRowIds, getIsEditingRowId, removeFromIsEditingRowIds } =
 *     useIsEditingRowIds();
 *
 *   return (
 *     <input
 *       data-is-editing={getIsEditingRowId(id)}
 *       onClick={(e) => {
 *         const { checked } = e.currentTarget;
 *
 *         if (checked) {
 *           addToIsEditingRowIds(id);
 *         } else {
 *           removeFromIsEditingRowIds(id);
 *         }
 *       }}
 *       type="checkbox"
 *     />
 *   );
 * };
 * ```
 */
export const getUseIsEditingRowIds = <TData extends string | number>(
  defaultValue: TData[] = [],
) => {
  return create<{
    addToIsEditingRowIds: (value: TData | TData[]) => void;
    getIsEditingRowId: (value: TData) => boolean;
    isEditingRowIds: TData[];
    removeFromIsEditingRowIds: (value: TData | TData[]) => void;
    resetIsEditingRowIds: () => void;
    setIsEditingRowIds: (
      value: TData[] | ((prevValues: TData[]) => TData[]),
    ) => void;
  }>((set, get) => {
    return {
      addToIsEditingRowIds: (value) => {
        const isArray = Array.isArray(value);

        const { setIsEditingRowIds } = get();

        setIsEditingRowIds((prev) => {
          if (isArray) {
            return [...prev, ...value];
          } else {
            return [...prev, value];
          }
        });
      },
      getIsEditingRowId: (value) => {
        const { isEditingRowIds } = get();

        return isEditingRowIds.includes(value);
      },
      isEditingRowIds: defaultValue,
      removeFromIsEditingRowIds: (value) => {
        const isArray = Array.isArray(value);

        const { setIsEditingRowIds } = get();

        setIsEditingRowIds((prev) => {
          return prev.filter((prevValue) => {
            if (isArray) {
              const isInPrevValues = value.includes(prevValue);

              return !isInPrevValues;
            } else {
              const isInPrevValues = value === prevValue;

              return !isInPrevValues;
            }
          });
        });
      },
      resetIsEditingRowIds: () => {
        set({
          isEditingRowIds: defaultValue,
        });
      },
      setIsEditingRowIds: (value) => {
        if (typeof value === 'function') {
          const { isEditingRowIds } = get();

          const newValue = value(isEditingRowIds);

          set({ isEditingRowIds: newValue });
        } else {
          set({ isEditingRowIds: value });
        }
      },
    };
  });
};

export const CollectionsPage: RouteComponent = () => {
  const collections = Route.useLoaderData();

  return (
    <PageWrapper title="Collections">
      <div className="grid grid-cols-1 gap-4">
        <h3>Add Collection</h3>
        <AddCollectionForm />
      </div>
      <Table columns={collectionTableColumns} data={collections.data} />
    </PageWrapper>
  );
};
