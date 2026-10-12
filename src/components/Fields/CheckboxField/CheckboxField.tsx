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
        {required ? <span className="text-theme-alert">*</span> : undefined}
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
              <CheckBoxIcon
                className={
                  disabled
                    ? 'text-theme-disabled'
                    : 'text-theme-link hover:text-theme-link-hover'
                }
              />
            ) : indeterminate ? (
              <IndeterminateCheckBoxIcon
                className={
                  disabled
                    ? 'text-theme-disabled'
                    : 'text-theme-link hover:text-theme-link-hover'
                }
              />
            ) : (
              <CheckBoxOutlineBlankIcon
                className={
                  disabled
                    ? 'text-theme-disabled'
                    : 'text-theme-t1 dark:text-theme-t2 hover:text-theme-link-hover'
                }
              />
            )}
          </Checkbox.Indicator>
        </Checkbox.Root>

        {labelPosition === 'right' && <Label />}
      </div>
    </FieldWrapper>
  );
};
