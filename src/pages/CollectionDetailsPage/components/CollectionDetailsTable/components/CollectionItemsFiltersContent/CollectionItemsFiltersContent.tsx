import type { PropsWithChildren } from 'react';

import { Slider } from '@base-ui/react';
import { useLayoutEffect, useMemo } from 'react';

import type { DefaultSelectItemDef } from '#/components/Fields/SelectField/SelectField.types';

import { useGetFiltersForCollection } from '#/api/routes/collection-items/get-filters-for-collection/get-filters-for-collection.react-query';
import { Button } from '#/components/Button';
import { CheckboxField } from '#/components/Fields/CheckboxField';
import { FieldWrapper } from '#/components/Fields/FieldWrapper';
import { SelectField } from '#/components/Fields/SelectField';

import type { CollectionItemsFiltersFormDef } from '../../hooks/use-collection-details-filters-props';

const FiltersBlock = (
  props: PropsWithChildren<{
    label: string | null;
    onReset: () => void;
  }>,
) => {
  const { children, label, onReset } = props;

  return (
    <div className="grid gap-1">
      <div className="flex items-center gap-2">
        <h5>{label}</h5>

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

  const { data: filterOptions } = useGetFiltersForCollection({
    // TODO - create global store for when the filters have been opened
    enabled: false,
    placeholderData: [],
    requestArgs: { id: collectionId },
  });

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

  useLayoutEffect(() => {
    form.reset();
  }, []);

  return (
    <div className="grid gap-5">
      {filterOptions.map((customField) => {
        return (
          <form.Field key={customField.id} name={`filters.${customField.id}`}>
            {(field) => {
              return (
                <form.Subscribe
                  selector={({ values }) => {
                    return values.filters[customField.id];
                  }}
                >
                  {(fieldValue) => {
                    if (
                      customField.type === 'string' &&
                      fieldValue?.type === 'string'
                    ) {
                      const { handleChange } = field;
                      const { items } = fieldValue;

                      const resetValue: typeof items = [];

                      return (
                        <FiltersBlock
                          key={customField.id}
                          label={customField.name}
                          onReset={() => {
                            handleChange({
                              ...fieldValue,
                              items: resetValue,
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

                    if (
                      customField.type === 'number' &&
                      fieldValue?.type === 'number'
                    ) {
                      const { handleChange } = field;

                      return (
                        <FiltersBlock
                          key={customField.id}
                          label={customField.name}
                          onReset={() => {
                            field.handleChange({
                              ...fieldValue,
                              range: customField.range,
                            });
                          }}
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
                              value={[
                                fieldValue?.range.min,
                                fieldValue?.range.max,
                              ]}
                            >
                              <Slider.Control className="py-2">
                                <Slider.Track className="bg-gray-500 h-1 w-full">
                                  <Slider.Indicator className="bg-primary-700" />
                                  <Slider.Thumb
                                    aria-label="Minimum value"
                                    className="size-3 bg-primary-700 rounded-xl"
                                    index={0}
                                  />
                                  <Slider.Thumb
                                    aria-label="Maximum value"
                                    className="size-3 bg-primary-700 rounded-xl"
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

                    if (
                      customField.type === 'boolean' &&
                      fieldValue?.type === 'boolean'
                    ) {
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
                </form.Subscribe>
              );
            }}
          </form.Field>
        );
      })}
    </div>
  );
};
