export type CustomFieldValuesByFieldId = Record<
  /** Parent custom field ID */
  number,
  | {
      /** Child custom field **value** ID */
      id: number;
      valueBoolean: boolean | null;
      valueNumber: number | null;
      valueText: string | null;
    }
  | undefined
>;

export type CustomFieldValueDef = string | number | boolean;
