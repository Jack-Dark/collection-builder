export type CustomFieldValuesByFieldId = Record<
  /** Parent custom field ID */
  number,
  | {
      data: {
        value: CustomFieldValueDef;
      };
      /** Child custom field **value** ID */
      id: number;
    }
  | undefined
>;

export type CustomFieldValueDef = string | number | boolean;
