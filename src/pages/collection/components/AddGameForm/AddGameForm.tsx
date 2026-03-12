import type { RouteComponent } from '@tanstack/react-router';

import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
  Stack,
  Autocomplete,
  FormControl,
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
      onSubmit: apiRoutes.games.createSchema,
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
        <form.Subscribe
          selector={(state) => {
            return {
              errors: state.errors,
            };
          }}
        >
          {({ errors }) => {
            return (
              <form.Field name="name">
                {(field) => {
                  const errorMsg = errors?.[0]?.[field.name]?.[0]?.message;

                  return (
                    <TextField
                      error={!!errorMsg}
                      helperText={errorMsg}
                      label="Name"
                      name={field.name}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                      }}
                      required
                      sx={{ width: '100%' }}
                    />
                  );
                }}
              </form.Field>
            );
          }}
        </form.Subscribe>
        <form.Subscribe
          selector={(state) => {
            return {
              errors: state.errors,
            };
          }}
        >
          {({ errors }) => {
            return (
              <form.Field name="system">
                {(field) => {
                  const errorMsg = errors?.[0]?.[field.name]?.[0]?.message;

                  return (
                    <FormControl fullWidth>
                      <Autocomplete
                        onChange={(_e, value) => {
                          field.setValue(value!);
                        }}
                        // disablePortal
                        options={systemsList}
                        renderInput={(params) => {
                          return (
                            <TextField
                              {...params}
                              error={!!errorMsg}
                              helperText={errorMsg}
                              label="System"
                              name={field.name}
                              required
                            />
                          );
                        }}
                      />
                    </FormControl>
                  );
                }}
              </form.Field>
            );
          }}
        </form.Subscribe>

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
              <FormGroup>
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
              errors: state.errors,
              isSpecialEdition: state.values.isSpecialEdition,
            };
          }}
        >
          {({ editionDetails, errors, isSpecialEdition }) => {
            return (
              isSpecialEdition && (
                <form.Field name="editionDetails">
                  {(field) => {
                    const errorMsg = errors?.[0]?.[field.name]?.[0]?.message;

                    return (
                      <TextField
                        error={!!errorMsg}
                        helperText={errorMsg}
                        label="Edition details"
                        name={field.name}
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                        }}
                        required
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
              values: state.values,
            };
          }}
        >
          {(state) => {
            console.clear();
            console.log('🚀 ~ AddGameForm ~ state:', state);

            const { isFormValid, isValid } = state;

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
