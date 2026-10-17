import type { PropsWithChildren } from 'react';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getCookie, setCookie } from '@tanstack/react-start/server';
import { useMemo } from 'react';
import z from 'zod';

import type { MenuItemDef } from '#/components/MoreMenu/MoreMenu.types';
import type { TableSettingsMenuPropsDef } from '#/components/Table/components/TableSettingsMenu/TableSettingsMenu.types';

import { Route as CollectionDetailsRoute } from '#/routes/_protected/collections/$id';

import { useOnUpdateCollectionItemsQueries } from '../../../../hooks/use-on-update-collection-items-queries';

const articlesToIgnore = ['the', 'a', 'an'];

export const useCollectionDetailsSettingsProps = () => {
  const { onUpdateCollectionItemsQueries, searchQueries } =
    useOnUpdateCollectionItemsQueries();

  const onClickIgnoreSortArticles = (ignoreSortArticles: boolean) => {
    onUpdateCollectionItemsQueries({ ignoreSortArticles });
  };

  const MemoizedIgnoreSortArticlesLabel = useMemo(() => {
    return IgnoreSortArticlesLabel;
  }, []);

  const MemoizedAutoPopulateCustomFieldValues = useMemo(() => {
    return AutoPopulateCustomFieldValues;
  }, []);

  const { autoPopulateCustomFieldValues } =
    CollectionDetailsRoute.useLoaderData();

  const router = useRouter();

  const items = useMemo(() => {
    return [
      {
        active: searchQueries.ignoreSortArticles,
        closeOnClick: false,
        key: 'ignore-sort-articles',
        Label: <MemoizedIgnoreSortArticlesLabel />,
        onClick: () => {
          onClickIgnoreSortArticles?.(!searchQueries.ignoreSortArticles);
        },
      },
      {
        active: autoPopulateCustomFieldValues,
        closeOnClick: false,
        key: 'auto-populate',
        Label: <MemoizedAutoPopulateCustomFieldValues />,

        onClick: async () => {
          await setAutoPopulateCustomFieldValuesServerFn({
            data: !autoPopulateCustomFieldValues,
          });
          router.invalidate();
        },
      },
      {
        disabled: true,
        key: 'download-data',
        Label: (
          // TODO - FEATURE: ADD DOWNLOAD DATA SUPPORT
          <WrapLabelWithStatus>Download data (coming soon)</WrapLabelWithStatus>
        ),
      },
      {
        disabled: true,
        key: 'upload-data',
        Label: (
          // TODO - FEATURE: ADD UPLOAD DATA SUPPORT
          <WrapLabelWithStatus>Upload data (coming soon)</WrapLabelWithStatus>
        ),
      },
    ] satisfies MenuItemDef[];
  }, [autoPopulateCustomFieldValues, searchQueries.ignoreSortArticles]);

  return {
    items,
  } satisfies TableSettingsMenuPropsDef;
};

const WrapLabelWithStatus = (
  props: PropsWithChildren<{ active?: boolean }>,
) => {
  const { active, children } = props;

  return (
    <div className="grid gap-3 grid-cols-[max-content_1fr] max-w-75">
      <div className="h-full w-6 flex items-center">
        {active !== undefined && (active ? <CheckIcon /> : <CloseIcon />)}
      </div>
      <div>{children}</div>
    </div>
  );
};

const IgnoreSortArticlesLabel = () => {
  const { searchQueries } = useOnUpdateCollectionItemsQueries();

  return (
    <WrapLabelWithStatus active={searchQueries.ignoreSortArticles}>
      <p>Ignore articles when sorting</p>
      <span className="text-theme-t2 text-sm">
        (Values that start with{' '}
        {articlesToIgnore.reduce((acc, value, index) => {
          const isLastIndex = index === articlesToIgnore.length - 1;
          const formattedValue = `"${value}"`;
          if (isLastIndex) {
            return `${acc} or ${formattedValue}`;
          } else {
            return `${acc}${formattedValue}, `;
          }
        }, '')}
        )
      </span>
    </WrapLabelWithStatus>
  );
};

const AutoPopulateCustomFieldValues = () => {
  const { autoPopulateCustomFieldValues } =
    CollectionDetailsRoute.useLoaderData();

  return (
    <WrapLabelWithStatus active={autoPopulateCustomFieldValues}>
      Auto-populate new items with the last entered custom field values.
    </WrapLabelWithStatus>
  );
};

const autoPopulateCustomFieldValuesSchema = z
  .union([z.stringbool(), z.boolean()])
  .optional()
  .default(false);

const autoPopulateCustomFieldValuesCookieKey =
  '_auto-populate-custom-field-values';

export const getAutoPopulateCustomFieldValuesServerFn =
  createServerFn().handler(async () => {
    const cookieValue = getCookie(autoPopulateCustomFieldValuesCookieKey);

    const { data, error, success } =
      autoPopulateCustomFieldValuesSchema.safeParse(cookieValue);

    if (success) {
      return data;
    } else {
      console.error(error);
    }
  });

export const setAutoPopulateCustomFieldValuesServerFn = createServerFn({
  method: 'POST',
})
  .validator(autoPopulateCustomFieldValuesSchema)
  .handler(async ({ data }) => {
    const stringValue = String(data);
    const { error, success } =
      autoPopulateCustomFieldValuesSchema.safeParse(stringValue);

    if (success) {
      setCookie(autoPopulateCustomFieldValuesCookieKey, stringValue);
    } else {
      console.error(error);
    }
  });
