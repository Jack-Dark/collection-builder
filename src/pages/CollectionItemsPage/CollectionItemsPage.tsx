import type { RouteComponent } from '@tanstack/react-router';

import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { revalidateLogic } from '@tanstack/react-form';
import { useRouter, useSearch } from '@tanstack/react-router';
import { useEffect } from 'react';
import { create } from 'zustand';

import type { CollectionRecordDef } from '#/api/routes/collections/server/types';
import type { CollectionItemsFiltersSchema } from '#/routes/api/collections/$id';

import {
  useCreateCollectionItem,
  useUpdateCollectionItem,
} from '#/api/routes/collection-items/client/hooks';
import { collectionItemFormSchema } from '#/api/routes/collection-items/server/serverFns';
import { Button } from '#/components/Button';
import { CheckboxField } from '#/components/CheckboxField';
import { Table } from '#/components/Table';
import { getCreateDefaultZustandState } from '#/helpers/get-create-default-zustand-state';
import { PageWrapper } from '#/page-wrapper';
import { Route as CollectionRoute } from '#/routes/_protected/collections/$id';

import type { AddCollectionItemFormSchemaDef } from './components/AddCollectionItemForm/types';

import { useEditingCollectionItemsRowIds } from '../CollectionsListPage/hooks/use-editing-collections-row-ids';
import { getCollectionItemsTableColumns } from './columns';
import { AddCollectionItemFormTableRow } from './components/AddCollectionItemForm';
import {
  addCollectionItemFormDefaultValues,
  useAddCollectionItemForm,
} from './components/AddCollectionItemForm/constants';

export const useCollectionItemsFormStore = create<{
  collectionItemFormValues: AddCollectionItemFormSchemaDef;
  resetCollectionItemFormValues: () => void;
  setCollectionItemFormValues: (values: AddCollectionItemFormSchemaDef) => void;
}>((set) => {
  return {
    collectionItemFormValues: addCollectionItemFormDefaultValues,
    resetCollectionItemFormValues: () => {
      set({
        collectionItemFormValues: addCollectionItemFormDefaultValues,
      });
    },
    setCollectionItemFormValues: (values) => {
      set({
        collectionItemFormValues: values,
      });
    },
  };
});

export const CollectionItemsPage: RouteComponent = () => {
  const { collection, customFields, items, lastAddedItem } =
    CollectionRoute.useLoaderData();

  const router = useRouter();

  const {
    collectionItemFormValues,
    resetCollectionItemFormValues,
    setCollectionItemFormValues,
  } = useCollectionItemsFormStore();

  const { onCreateCollectionItem } = useCreateCollectionItem({
    onSuccess: () => {
      resetCollectionItemFormValues();
    },
  });

  const { onUpdateCollectionItem } = useUpdateCollectionItem({
    onSuccess: () => {
      resetCollectionItemFormValues();
    },
  });

  const { addToEditingRowIds, isEditing, resetEditingRowIds } =
    useEditingCollectionItemsRowIds();

  const form = useAddCollectionItemForm({
    defaultValues: collectionItemFormValues,
    onSubmit: async ({ value }) => {
      if (value.id) {
        await onUpdateCollectionItem({
          data: value,
        });

        resetEditingRowIds();
      } else {
        await onCreateCollectionItem({
          data: {
            // undefined values added long-hand to resolve type errors
            ...value,
            createdAt: undefined,
            id: undefined,
            userId: undefined,
          },
        });
      }

      form.reset();

      await router.invalidate();
    },
    validationLogic: revalidateLogic({
      mode: 'submit',
      modeAfterSubmission: 'change',
    }),
    validators: {
      onSubmit: collectionItemFormSchema,
    },
  });

  const columns = getCollectionItemsTableColumns(collection);

  const { getFilters } = useCollectionItemsFilters();

  useEffect(() => {
    setCollectionItemFormValues({
      ...collectionItemFormValues,
      collectionId: collection.id,
      customField1Value: lastAddedItem?.customField1Value || '',
      customField2Value: lastAddedItem?.customField2Value || '',
      customField3Value: lastAddedItem?.customField3Value || '',
      notes: collectionItemFormValues.notes || '',
    });
  }, [lastAddedItem]);

  useEffect(() => {
    form.reset();
  }, [isEditing]);

  return (
    <PageWrapper childrenClassName="grid gap-8" title={collection?.name || '-'}>
      <div className="grid grid-cols-1 gap-4">
        {!isEditing && (
          <div className="flex justify-end">
            <Button
              Icon={ControlPointIcon}
              onClick={() => {
                addToEditingRowIds('');
              }}
              text="Add New"
              variant="secondary"
            />
          </div>
        )}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <Table
          BodyTopRow={
            isEditing
              ? (props) => {
                  return (
                    <AddCollectionItemFormTableRow
                      customField1Enabled={collection.customField1Enabled}
                      customField1Label={collection.customField1Label || ''}
                      customField2Enabled={collection.customField2Enabled}
                      customField2Label={collection.customField2Label || ''}
                      customField3Enabled={collection.customField3Enabled}
                      customField3Label={collection.customField3Label || ''}
                      customFields={customFields}
                      form={form}
                      onCancel={() => {
                        resetEditingRowIds();
                        resetCollectionItemFormValues();
                        form.reset();
                      }}
                      // tdClassNames={`${tdClassNames} align-items-center min-h-[501px]`}
                      {...props}
                    />
                  );
                }
              : undefined
          }
          columns={columns}
          data={items || []}
          filters={{
            FiltersContent: () => {
              return (
                <CollectionItemFiltersContent
                  collection={collection}
                  customFields={customFields}
                />
              );
            },
            onSave: async ({ onClose }) => {
              const filters = getFilters();
              router.navigate({
                params: { id: String(collection.id) },
                reloadDocument: true,
                resetScroll: true,
                search: {
                  filters,
                },
                to: '/collections/$id',
              });

              // onClose();

              // router.invalidate();
            },
          }}
        />
      </form>
    </PageWrapper>
  );
};

const CollectionItemFiltersContent = (props: {
  collection: CollectionRecordDef;
  customFields: {
    customField1Values: string[];
    customField2Values: string[];
    customField3Values: string[];
  };
}) => {
  const { collection, customFields } = props;

  const { filters, setFilters } = useCollectionItemsFilters();

  const queries = useSearch({
    from: '/_protected/collections/$id',
  });

  const searchQueryFilters = queries?.filters;
  useEffect(() => {
    if (searchQueryFilters) {
      setFilters(searchQueryFilters);
    }
  }, [searchQueryFilters]);

  return (
    <div className="grid gap-5">
      {([1, 2, 3] as const).map((num) => {
        const isEnabled = collection[`customField${num}Enabled`];
        const label = collection[`customField${num}Label`];
        const values = customFields[`customField${num}Values`];
        const customFieldKey = `customField${num}` as const;

        return (
          <div className="grid gap-1" key={num}>
            {isEnabled && (
              <>
                <h5>{label}</h5>
                {values.map((value) => {
                  return (
                    <CheckboxField
                      checked={filters[customFieldKey].includes(value)}
                      key={value}
                      label={value}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilters((prevFilters) => {
                            const newSelections = [
                              ...prevFilters[customFieldKey],
                              value,
                            ];

                            return {
                              ...prevFilters,
                              [customFieldKey]: newSelections,
                            };
                          });
                        } else {
                          setFilters((prevFilters) => {
                            const newSelections = prevFilters[
                              customFieldKey
                            ].filter((item) => {
                              return item !== value;
                            });

                            return {
                              ...prevFilters,
                              [customFieldKey]: newSelections,
                            };
                          });
                        }
                      }}
                    />
                  );
                })}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

const createFiltersState = (defaultValues: CollectionItemsFiltersSchema) => {
  const createState = getCreateDefaultZustandState(defaultValues);

  return () => {
    const { getValue, resetValue, setValue, value } = createState();

    return {
      filters: value,
      getFilters: getValue,
      resetFilters: resetValue,
      setFilters: setValue,
    };
  };
};

const useCollectionItemsFilters = createFiltersState({
  customField1: [],
  customField2: [],
  customField3: [],
});
