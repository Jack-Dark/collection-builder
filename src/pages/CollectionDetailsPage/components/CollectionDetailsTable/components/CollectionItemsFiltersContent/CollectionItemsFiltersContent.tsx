import type { PropsWithChildren } from 'react';

import { Slider } from '@base-ui/react';
import { useSelector } from '@tanstack/react-store';
import { useLayoutEffect, useMemo } from 'react';

import type { GetFiltersForCollectionResponseDef } from '#/api/routes/collection-items/get-filters-for-collection/get-filters-for-collection.types';
import type { DefaultSelectItemDef } from '#/components/Fields/SelectField/SelectField.types';

import { useGetFiltersForCollection } from '#/api/routes/collection-items/get-filters-for-collection/get-filters-for-collection.react-query';
import { Button } from '#/components/Button';
import { CheckboxField } from '#/components/Fields/CheckboxField';
import { FieldWrapper } from '#/components/Fields/FieldWrapper';
import { SelectField } from '#/components/Fields/SelectField';
import { Popover } from '#/components/Popover';

import type { CollectionItemsFiltersFormDef } from '../../hooks/use-collection-details-filters-props';

type FiltersBlockPropsDef = PropsWithChildren<{
  label: string | null;
  onReset: () => void;
  popoverMsg?: string;
}>;

const FiltersBlock = (props: FiltersBlockPropsDef) => {
  const { children, label, onReset, popoverMsg } = props;

  return (
    <div className="grid gap-1">
      <div className="flex items-center gap-2">
        <h5 className="grid grid-cols-[auto_1fr] gap-1">
          {label}
          {popoverMsg && <Popover Description={popoverMsg} />}
        </h5>

        <Button
          className="font-normal"
          onClick={onReset}
          size="xs"
          text="Reset"
          variant="ghost"
        />
      </div>

      {children}
    </div>
  );
};

type CollectionDetailsFiltersContentPropsDef = {
  collectionId: number;
  form: CollectionItemsFiltersFormDef;
};

export const CollectionDetailsFiltersContent = (
  props: CollectionDetailsFiltersContentPropsDef,
) => {
  const { collectionId, form } = props;

  // TODO - WRAP IN SUSPENSE SO REQUEST IS MADE ON DEMAND
  const { data: filterOptions } = useGetFiltersForCollection({
    placeholderData: [],
    requestArgs: { id: collectionId },
  });

  useLayoutEffect(() => {
    form.reset();
  }, []);

  return (
    <div className="grid gap-5">
      {filterOptions.map((customField) => {
        return (
          <CustomFieldTypeFilter
            customField={customField}
            form={form}
            key={customField.id}
          />
        );
      })}
    </div>
  );
};

const CustomFieldTypeFilter = (props: {
  customField: GetFiltersForCollectionResponseDef[number];
  form: CollectionItemsFiltersFormDef;
}) => {
  const { customField, form } = props;

  const fieldValue = useSelector(form.atom, ({ values }) => {
    return values.filters[customField.id];
  });

  if (customField.type === 'string' && fieldValue?.type === 'string') {
    return <CustomFieldStringFilter customField={customField} form={form} />;
  }

  if (customField.type === 'number' && fieldValue?.type === 'number') {
    return <CustomFieldNumberFilter customField={customField} form={form} />;
  }

  if (customField.type === 'boolean' && fieldValue?.type === 'boolean') {
    return <CustomFieldBooleanFilter customField={customField} form={form} />;
  }

  return null;
};

const CustomFieldBooleanFilter = (props: {
  customField: GetFiltersForCollectionResponseDef[number];
  form: CollectionItemsFiltersFormDef;
}) => {
  const { customField, form } = props;

  const booleanSelectItems = useMemo(() => {
    return [
      {
        label: `Select status...`,
        placeholder: true,
        value: null,
      },
      { label: 'True', value: true },
      { label: 'False', value: false },
    ] satisfies DefaultSelectItemDef[];
  }, []);

  const fieldValue = useSelector(form.atom, ({ values }) => {
    return values.filters[customField.id];
  });

  return (
    <form.Field key={customField.id} name={`filters.${customField.id}`}>
      {(field) => {
        // ? Comparison is really just for type safety
        if (customField.type === 'boolean' && fieldValue?.type === 'boolean') {
          const { handleChange } = field;
          const { value } = fieldValue;

          const selectedItem = booleanSelectItems.find((item) => {
            return item.value === value;
          });

          return (
            <FiltersBlock
              key={customField.id}
              label={customField.name}
              onReset={() => {
                handleChange({
                  ...fieldValue,
                  value: null,
                });
              }}
            >
              <SelectField
                idProperty="value"
                items={booleanSelectItems}
                labelProperty="label"
                name={field.name}
                onValueChange={(item) => {
                  if (item) {
                    handleChange({
                      ...fieldValue,
                      value: item.value,
                    });
                  }
                }}
                value={selectedItem}
              />
            </FiltersBlock>
          );
        }
      }}
    </form.Field>
  );
};

const CustomFieldNumberFilter = (props: {
  customField: GetFiltersForCollectionResponseDef[number];
  form: CollectionItemsFiltersFormDef;
}) => {
  const { customField, form } = props;

  const fieldValue = useSelector(form.atom, ({ values }) => {
    return values.filters[customField.id];
  });

  return (
    <form.Field key={customField.id} name={`filters.${customField.id}`}>
      {(field) => {
        // ? Comparison is really just for type safety
        if (customField.type === 'number' && fieldValue?.type === 'number') {
          const isMinEqualToMax =
            customField.range.min === customField.range.max;
          const { handleChange } = field;

          return isMinEqualToMax ? null : (
            <FiltersBlock
              key={customField.id}
              label={customField.name}
              onReset={() => {
                field.handleChange({
                  ...fieldValue,
                  range: customField.range,
                });
              }}
              popoverMsg={`If at the maximum range, items with undefined ${customField.name} will be returned.`}
            >
              <FieldWrapper
                error={field.errors}
                hideLabel
                label={customField.name}
                name={field.name}
              >
                <Slider.Root
                  max={customField.range.max}
                  min={customField.range.min}
                  onValueChange={([min, max]) => {
                    handleChange({
                      ...fieldValue,
                      range: {
                        max,
                        min,
                      },
                    });
                  }}
                  value={[fieldValue?.range.min, fieldValue?.range.max]}
                >
                  <Slider.Control className="py-2 cursor-pointer data-dragging:cursor-grabbing">
                    <Slider.Track className="bg-gray-500 h-1 w-full">
                      <Slider.Indicator className="bg-primary-700" />
                      <Slider.Thumb
                        aria-label="Minimum value"
                        className="size-3 bg-primary-700 rounded-xl cursor-grab"
                        index={0}
                      />
                      <Slider.Thumb
                        aria-label="Maximum value"
                        className="size-3 bg-primary-700 rounded-xl cursor-grab"
                        index={1}
                      />
                    </Slider.Track>
                  </Slider.Control>
                </Slider.Root>
              </FieldWrapper>
              {fieldValue?.range.min} - {fieldValue?.range.max}
            </FiltersBlock>
          );
        }
      }}
    </form.Field>
  );
};

const CustomFieldStringFilter = (props: {
  customField: GetFiltersForCollectionResponseDef[number];
  form: CollectionItemsFiltersFormDef;
}) => {
  const { customField, form } = props;

  const fieldValue = useSelector(form.atom, ({ values }) => {
    return values.filters[customField.id];
  });

  return (
    <form.Field key={customField.id} name={`filters.${customField.id}`}>
      {(field) => {
        // ? Comparison is really just for type safety
        if (customField.type === 'string' && fieldValue?.type === 'string') {
          const { handleChange } = field;
          const { items } = fieldValue;

          return (
            <FiltersBlock
              key={customField.id}
              label={customField.name}
              onReset={() => {
                handleChange({
                  ...fieldValue,
                  items: [],
                });
              }}
            >
              {customField.items.map((item) => {
                const onCheckedChange = (checked: boolean) => {
                  if (checked) {
                    handleChange({
                      ...fieldValue,
                      items: [...fieldValue.items, item.value],
                    });
                  } else {
                    handleChange({
                      ...fieldValue,
                      items: fieldValue.items.filter((value) => {
                        return value !== item.value;
                      }),
                    });
                  }
                };

                return (
                  <CheckboxField
                    checked={items.some((fieldValue) => {
                      return fieldValue === item.value;
                    })}
                    key={item.value}
                    label={item.label}
                    name={field.name}
                    onCheckedChange={onCheckedChange}
                  />
                );
              })}
            </FiltersBlock>
          );
        }
      }}
    </form.Field>
  );
};
