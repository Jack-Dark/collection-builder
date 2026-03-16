import type { CheckboxRootProps } from '@base-ui/react/checkbox';

import { Checkbox } from '@base-ui/react/checkbox';
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';

import type { FieldWrapperProps } from '../FieldWrapper';

import { FieldWrapper } from '../FieldWrapper';

type CheckboxFieldProps = Pick<
  CheckboxRootProps,
  'checked' | 'onCheckedChange'
> &
  FieldWrapperProps;

export const CheckboxField = (props: CheckboxFieldProps) => {
  const {
    checked,
    className,
    description,
    disabled,
    error,
    invalid,
    label,
    name,
    onCheckedChange,
    required,
    validationDebounceTime,
    validationMode,
  } = props;

  return (
    <FieldWrapper
      className={className}
      description={description}
      disabled={disabled}
      error={error}
      invalid={invalid}
      label={label}
      name={name}
      required={required}
      validationDebounceTime={validationDebounceTime}
      validationMode={validationMode}
    >
      <Checkbox.Root checked={checked} onCheckedChange={onCheckedChange}>
        <Checkbox.Indicator keepMounted>
          {checked ? <CheckBox /> : <CheckBoxOutlineBlank />}
        </Checkbox.Indicator>
      </Checkbox.Root>
    </FieldWrapper>
  );
};
