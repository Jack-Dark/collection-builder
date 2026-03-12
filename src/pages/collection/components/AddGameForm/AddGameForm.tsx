import type { RouteComponent } from '@tanstack/react-router';

import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Stack,
} from '@mui/material';
import { useForm } from '@tanstack/react-form';
import { useRouter } from '@tanstack/react-router';
import { apiRoutes } from '#/api/routes';

import { systemsList, defaultValues } from './constants';

export const AddGameForm: RouteComponent = () => {
  const router = useRouter();

  const form = useForm({
    defaultValues: defaultValues,
    onSubmit: async ({ value }) => {
      await apiRoutes.games.create({ data: value });
      router.invalidate();
    },
    validators: {
      onChange: apiRoutes.games.createSchema,
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <Stack
        spacing={2}
        sx={{
          alignItems: 'flex-start',
        }}
      >
        <form.Field name="name">
          {(field) => {
            return (
              <TextField
                sx={{ width: '100%' }}
                {...field}
                label="Name"
                onChange={(e) => {
                  field.handleChange(e.target.value);
                }}
              />
            );
          }}
        </form.Field>
        <form.Field name="system">
          {(field) => {
            return (
              <FormControl fullWidth>
                <InputLabel>System</InputLabel>
                <Select
                  {...field}
                  label="System"
                  onChange={(e) => {
                    field.handleChange(e.target.value as string);
                  }}
                >
                  {systemsList.map((name) => {
                    return <MenuItem value={name}>{name}</MenuItem>;
                  })}
                </Select>
              </FormControl>
            );
          }}
        </form.Field>

        <form.Field
          listeners={{
            onChange: ({ value: isSpecialEdition }) => {
              form.setFieldValue(
                'editionDetails',
                isSpecialEdition ? "Collector's Edition" : '',
              );
            },
          }}
          name="isSpecialEdition"
        >
          {(field) => {
            return (
              <FormGroup {...field}>
                <FormControlLabel
                  control={
                    <Checkbox
                      className="p-0"
                      onChange={(e) => {
                        field.handleChange(e.target.checked);
                      }}
                      sx={{ paddingBottom: 0, paddingTop: 0 }}
                    />
                  }
                  label="Is this a special edition?"
                />
              </FormGroup>
            );
          }}
        </form.Field>

        <form.Subscribe
          selector={(state) => {
            return {
              editionDetails: state.values.editionDetails,
              isSpecialEdition: state.values.isSpecialEdition,
            };
          }}
        >
          {({ editionDetails, isSpecialEdition }) => {
            return (
              isSpecialEdition && (
                <form.Field name="editionDetails">
                  {(field) => {
                    return (
                      <TextField
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                        }}
                        {...field}
                        label="Edition details"
                        value={editionDetails}
                      />
                    );
                  }}
                </form.Field>
              )
            );
          }}
        </form.Subscribe>

        <form.Subscribe
          selector={(state) => {
            return {
              errors: state.errors,
              isFormValid: state.isFormValid,
              isValid: state.isValid,
            };
          }}
        >
          {({ errors, isFormValid, isValid }) => {
            // console.clear();
            // console.log('🚀 ~ Collection ~ errors:', errors);

            return (
              <Button disabled={!isValid && !isFormValid} type="submit">
                <Typography>Submit</Typography>
              </Button>
            );
          }}
        </form.Subscribe>
      </Stack>
    </form>
  );
};
