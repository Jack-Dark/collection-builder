import { Field, Switch as SwitchMui } from '@base-ui/react';
import { useCallback } from 'react';

import type { SwitchFieldPropsDef } from './SwitchField.types';

import { FieldWrapper } from '../FieldWrapper';

export const SwitchField = (props: SwitchFieldPropsDef) => {
  const {
    checked,
    className,
    description,
    disabled,
    error,
    invalid,
    label,
    labelPosition = 'right',
    name,
    onCheckedChange,
    required,
    validationDebounceTime,
    validationMode,
  } = props;

  const Label = useCallback(() => {
    return label ? (
      <Field.Label className="cursor-pointer">
        {label}
        {required ? <span className="text-red-600">*</span> : undefined}
      </Field.Label>
    ) : null;
  }, [label, required]);

  return (
    <FieldWrapper
      className={className}
      description={description}
      disabled={disabled}
      error={error}
      invalid={invalid}
      name={name}
      required={required}
      validationDebounceTime={validationDebounceTime}
      validationMode={validationMode}
    >
      <div
        className={`grid gap-1 items-center ${label && 'grid-cols-[max-content_1fr]'}`}
      >
        {labelPosition === 'left' && <Label />}

        <SwitchMui.Root
          checked={checked}
          className={`flex h-5 w-9 shrink-0 rounded-2xl p-0.5 transition-colors duration-150 ease-[ease] border data-checked:bg-primary-900 data-checked:border-primary-900 ${
            disabled
              ? 'cursor-not-allowed border-gray-300 bg-gray-300'
              : 'cursor-pointer border-gray-500 bg-gray-500'
          }`}
          onCheckedChange={onCheckedChange}
        >
          <SwitchMui.Thumb className="size-3.5 rounded-2xl bg-white transition-[translate,background-color] duration-150 ease-[ease] data-checked:translate-x-4" />
        </SwitchMui.Root>

        {labelPosition === 'right' && <Label />}
      </div>
    </FieldWrapper>
  );
};
