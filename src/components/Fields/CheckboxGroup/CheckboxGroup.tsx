import type { CSSProperties } from 'react';

import { Field } from '@base-ui/react';
import { CheckboxGroup } from '@base-ui/react/checkbox-group';
import { useKeyHold } from '@tanstack/react-hotkeys';
import { useMemo, useState } from 'react';

import { getItemsInRange } from '#/components/Table';

import type { CheckboxGroupFieldPropsDef } from './CheckboxGroup.types';

import { CheckboxBase } from '../CheckboxField';

export const CheckboxGroupField = (props: CheckboxGroupFieldPropsDef) => {
  const {
    columns = 1,
    items,
    name,
    onValueChange,
    value: selectedValues,
    ...rest
  } = props;

  const [lastSelectedIndex, setLastSelectedIndex] = useState<number>(-1);

  const isShiftHeld = useKeyHold('Shift');

  const isBulkSelecting = isShiftHeld && lastSelectedIndex >= 0;

  const handleOnValueChange = (currentIndex: number) => {
    if (isBulkSelecting) {
      const valuesInRange = getItemsInRange({
        currentIndex,
        items,
        prevIndex: lastSelectedIndex,
      }).map(({ value }) => {
        return value;
      });

      const lastToggledItemValue = items[currentIndex].value;
      const isDeselecting = selectedValues.includes(lastToggledItemValue);

      if (isDeselecting) {
        const updatedValues = selectedValues.filter((value) => {
          const isSelected = valuesInRange.includes(value);

          return !isSelected;
        });
        onValueChange(updatedValues);
      } else {
        const updatedValues = new Set([...selectedValues, ...valuesInRange]);

        onValueChange([...updatedValues]);
      }
    }
  };

  // ? create styles as tailwind does not support dynamically created class names
  const gridStyles = useMemo(() => {
    const rows = Math.ceil(items.length / columns);

    return {
      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
    } satisfies CSSProperties;
  }, [columns]);

  return (
    <CheckboxGroup
      {...rest}
      className="grid grid-flow-col"
      onValueChange={(selectedItems) => {
        if (!isBulkSelecting) {
          onValueChange(selectedItems);
        }
      }}
      style={gridStyles}
      value={selectedValues}
    >
      {items.map((item, index) => {
        return (
          <Field.Root
            className="flex gap-1 items-center select-none"
            disabled={item.disabled}
            key={item.value}
          >
            <CheckboxBase
              disabled={item.disabled}
              name={name}
              onCheckedChange={() => {
                handleOnValueChange(index);
                setLastSelectedIndex(index);
              }}
              value={item.value}
            />
            <Field.Label className="cursor-pointer">{item.label}</Field.Label>
          </Field.Root>
        );
      })}
    </CheckboxGroup>
  );
};
