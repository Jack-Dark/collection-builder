import { Field } from '@base-ui/react';
import { Checkbox } from '@base-ui/react/checkbox';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
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
    indeterminate,
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
        className={`grid gap-1 items-center ${label && 'grid-cols-[max-content_1fr]'} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {labelPosition === 'left' && <Label />}

        <Checkbox.Root checked={checked} onCheckedChange={onCheckedChange}>
          <Checkbox.Indicator keepMounted>
            {checked ? (
              <CheckBoxIcon className="text-primary-900" />
            ) : indeterminate ? (
              <IndeterminateCheckBoxIcon className="text-primary-900" />
            ) : (
              <CheckBoxOutlineBlankIcon />
            )}
          </Checkbox.Indicator>
        </Checkbox.Root>

        {labelPosition === 'right' && <Label />}
      </div>
    </FieldWrapper>
  );
};
