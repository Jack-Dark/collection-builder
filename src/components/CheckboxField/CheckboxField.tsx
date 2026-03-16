import { Field } from '@base-ui/react';
import { Checkbox } from '@base-ui/react/checkbox';
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import { useCallback } from 'react';

import type { CheckboxFieldProps } from './CheckboxField.types';

import { FieldWrapper } from '../FieldWrapper';

export const CheckboxField = (props: CheckboxFieldProps) => {
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

        <Checkbox.Root checked={checked} onCheckedChange={onCheckedChange}>
          <Checkbox.Indicator keepMounted>
            {checked ? <CheckBox /> : <CheckBoxOutlineBlank />}
          </Checkbox.Indicator>
        </Checkbox.Root>

        {labelPosition === 'right' && <Label />}
      </div>
    </FieldWrapper>
  );
};
