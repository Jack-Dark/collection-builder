import type { ObjectValues } from '#/pages/Home/types/common';

import type { AddGameFormSchemaDef } from './types';

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

export const systemsList: ObjectValues<typeof systems>[] =
  Object.values(systems).sort();

export const defaultValues: AddGameFormSchemaDef = {
  editionDetails: '',
  isSpecialEdition: false,
  name: '',
  system: '',
};
