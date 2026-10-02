export type FormattedServerResponseDef<TData> = Promise<
  | {
      data: TData;
      error?: never;
      success: true;
    }
  | {
      data?: undefined;
      error: string;
      success: false;
    }
>;
