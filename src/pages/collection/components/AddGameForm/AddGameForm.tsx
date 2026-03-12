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
      onChange: apiRoutes.games.createSchema,
      onMount: apiRoutes.games.createSchema,
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
                label="Name"
                name={field.name}
                onChange={(e) => {
                  field.handleChange(e.target.value);
                }}
                sx={{ width: '100%' }}
              />
            );
          }}
        </form.Field>
        <form.Field name="system">
          {(field) => {
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
                      <TextField {...params} label="System" name={field.name} />
                    );
                  }}
                />
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
                        label="Edition details"
                        name={field.name}
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                        }}
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
