import type { FieldControlProps, FieldRootProps } from '@base-ui/react';
import type { CheckboxRootProps } from '@base-ui/react/checkbox';

import { Field } from '@base-ui/react';
import { Checkbox } from '@base-ui/react/checkbox';
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';

type CheckboxFieldProps = Pick<
  CheckboxRootProps,
  'checked' | 'onCheckedChange'
> &
  Pick<FieldControlProps, 'required'> &
  Pick<
    FieldRootProps,
    | 'name'
    | 'validationMode'
    | 'validationDebounceTime'
    | 'className'
    | 'invalid'
    | 'disabled'
  > & {
    label?: string;
    description?: string;
    error?: string;
  };

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
  console.clear();
  console.log('🚀 ~ CheckboxField ~ checked:', checked);

  return (
    <Field.Root
      className={className}
      disabled={disabled}
      invalid={invalid}
      name={name}
      validationDebounceTime={validationDebounceTime}
      validationMode={validationMode}
    >
      <Field.Label>
        {label}
        {required ? <span>*</span> : undefined}
        <Checkbox.Root checked={checked} onCheckedChange={onCheckedChange}>
          <Checkbox.Indicator keepMounted>
            {checked ? <CheckBox /> : <CheckBoxOutlineBlank />}
          </Checkbox.Indicator>
        </Checkbox.Root>
      </Field.Label>

      <Field.Description>{description}</Field.Description>
      <Field.Item
      /* Groups individual items in a checkbox group or radio group with a label and description. Renders a <div> element. */
      />
      <Field.Error>{error}</Field.Error>
      <Field.Validity>
        {(props) => {
          // console.log('🚀 ~ Field.Validity ~ props:', props);

          return <p>{error}</p>;
        }}
      </Field.Validity>
    </Field.Root>
  );
};
