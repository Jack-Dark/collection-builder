import { Field } from '@base-ui/react';
import { CheckboxGroup } from '@base-ui/react/checkbox-group';
import { useKeyHold } from '@tanstack/react-hotkeys';
import { useState } from 'react';

import { getItemsInRange } from '#/components/Table';

import type { CheckboxGroupFieldPropsDef } from './CheckboxGroup.types';

import { CheckboxBase } from '../CheckboxField';

export const CheckboxGroupField = (props: CheckboxGroupFieldPropsDef) => {
  const { items, name, onValueChange, value: selectedValues, ...rest } = props;

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

  return (
    <CheckboxGroup
      {...rest}
      onValueChange={(selectedItems) => {
        if (!isBulkSelecting) {
          onValueChange(selectedItems);
        }
      }}
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
                console.log('CHECKBOX index:', index);
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
