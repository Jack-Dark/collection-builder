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
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { createColumnHelper } from '@tanstack/react-table';
import { Table } from '#/components/Table';
import { createGame, getAllGames } from '#/db/queries/games';
import { useState } from 'react';
import * as zod from 'zod';

const systems = {
  microsoftXbox: 'Xbox',
  microsoftXbox360: 'Xbox 360',
  microsoftXboxOne: 'Xbox One',
  microsoftXboxSeriesX: 'Xbox Series X',
  nintendoGameboy: 'Gameboy',
  nintendoGameboyAdvance: 'Nintendo Gameboy Advance',
  nintendoGameboyAdvanceSP: 'Nintendo Gameboy Advance SP',
  nintendoGameboyColor: 'Nintendo Gameboy Color',
  nintendoGameboyDS: 'Nintendo DS',
  nintendoGamecube: 'Nintendo Gamecube',
  nintendoN64: 'Nintendo N64',
  nintendoNes: 'Nintendo NES',
  nintendoSnes: 'Nintendo SNES',
  nintendoSwitch: 'Nintendo Switch',
  nintendoSwitch2: 'Nintendo Switch 2',
  nintendoWii: 'Nintendo Wii',
  nintendoWiiU: 'Nintendo Wii U',
  other: 'Other',
  segaDreamcast: 'Dreamcast',
  sonyPlaystation: 'Playstation',
  sonyPlaystation2: 'Playstation 2',
  sonyPlaystation3: 'Playstation 3',
  sonyPlaystation4: 'Playstation 4',
  sonyPlaystation5: 'Playstation 5',
} as const;

const systemsList: ObjectValues<typeof systems>[] =
  Object.values(systems).sort();

/**
 * Usage:
 * ```ts
 * const myObjectMap = {...} as const;
 *
 * type MyObjectDef = ObjectValues<typeof myObjectMap>
 * ```
 * */
type ObjectValues<T extends Record<any, any>> = T[keyof T];

type System = ObjectValues<typeof systems>;

type CollectionItemDef = {
  id: number;
  name: string;
  system: string;
  /** If true, pushes to the systems table instead of the games table. */
  // isConsole: boolean;
  isSpecialEdition: boolean;
  editionDetails: string | null;
  // dateAdded: number;
};

const columnHelper = createColumnHelper<CollectionItemDef>();

const columns = [
  columnHelper.accessor('name', {
    cell: ({ getValue }) => {
      return <Typography>{getValue()}</Typography>;
    },
    header: 'Name',
  }),
  columnHelper.accessor('system', {
    cell: ({ getValue }) => {
      return <Typography>{getValue()}</Typography>;
    },
    header: 'System',
  }),
  columnHelper.accessor('editionDetails', {
    cell: ({ getValue }) => {
      const text = getValue();

      return text ? <Typography>{text}</Typography> : null;
    },
    header: 'Edition',
  }),
];

const collectionFormSchema = zod.object({
  editionDetails: zod.string().describe('Edition details'),
  isSpecialEdition: zod.boolean().describe('Is special edition'),
  name: zod.string().describe('Name').min(1),
  otherSystem: zod.string().describe('System name').optional(),
  system: zod.string().describe('System').min(1),
});

type CollectionFormSchemaDef = zod.Infer<typeof collectionFormSchema>;
const defaultValues: CollectionFormSchemaDef = {
  editionDetails: '',
  isSpecialEdition: false,
  name: '',
  otherSystem: '',
  system: '' as unknown as System,
};

const Collection = () => {
  const [showAddForm, setShowAddForm] = useState<boolean>(true);

  const router = useRouter();

  const form = useForm({
    defaultValues: defaultValues,
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.clear();
      console.log('🚀 ~ Submission values:', value);
      await createNewGame({ data: value });
      router.invalidate();
    },
    validators: {
      onChange: collectionFormSchema,
    },
  });

  const games = Route.useLoaderData();
  console.log('🚀 ~ Home ~ games:', games);

  return (
    <main className="page-wrap px-4 py-12">
      <section className="bg-white text-black rounded-2xl p-6 sm:p-8">
        <Stack spacing={4}>
          <Button
            onClick={async () => {
              // await getAllGames();
            }}
          >
            <Typography>MAKE ENDPOINT REQUEST</Typography>
          </Button>
          <Button
            onClick={() => {
              setShowAddForm((prev) => {
                return !prev;
              });
            }}
          >
            <Typography>{showAddForm ? 'Hide Form' : 'Add Game'}</Typography>
          </Button>
          {showAddForm && (
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
                <form.Field
                  listeners={{
                    onChange: () => {
                      form.setFieldValue('otherSystem', '');
                    },
                  }}
                  name="system"
                >
                  {(field) => {
                    return (
                      <FormControl fullWidth>
                        <InputLabel>System</InputLabel>
                        <Select
                          {...field}
                          label="System"
                          onChange={(e) => {
                            field.handleChange(e.target.value as System);
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

                <form.Subscribe
                  selector={(state) => {
                    return {
                      isOtherSystem: state.values.system === systems.other,
                      otherSystem: state.values.otherSystem,
                    };
                  }}
                >
                  {({ isOtherSystem, otherSystem }) => {
                    return (
                      isOtherSystem && (
                        <form.Field name="otherSystem">
                          {(field) => {
                            return (
                              <TextField
                                onChange={(e) => {
                                  field.handleChange(e.target.value);
                                }}
                                {...field}
                                label="System Name"
                                value={otherSystem}
                              />
                            );
                          }}
                        </form.Field>
                      )
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
          )}
          <Table columns={columns} data={games} />
        </Stack>
      </section>
    </main>
  );
};

export const Route = createFileRoute('/collections/video-games/')({
  component: Collection,
  loader: async () => {
    return fetchAllGames();
  },
});

const fetchAllGames = createServerFn({
  method: 'GET',
}).handler(() => {
  return getAllGames();
});

const createNewGame = createServerFn({
  method: 'POST',
})
  .inputValidator(collectionFormSchema)
  .handler(async ({ data }) => {
    return createGame(data);
  });
