import ClearIcon from '@mui/icons-material/Clear';
import NotesIcon from '@mui/icons-material/Notes';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { twJoin } from 'tailwind-merge';

import { Button } from '#/components/Button';
import { InputField } from '#/components/Fields/InputField';
import { Popover } from '#/components/Popover';

import type { SearchPropsDef } from './Search.types';

export const Search = (props: SearchPropsDef) => {
  const {
    enableSearchNotes,
    onChange,
    onClickSearchNotes,
    searchNotes,
    value,
  } = props;

  const [query, setQuery] = useState(value);

  const handleChange = (value: string) => {
    setQuery(value);
    onChange(value);
  };

  return (
    <div className="relative">
      <div className="absolute left-0 h-full p-1 flex items-center">
        {query ? (
          <Button
            aria-label="Search"
            className="pointer text-inherit hover:text-primary-800"
            Icon={ClearIcon}
            onClick={() => {
              setQuery('');
              onChange('');
            }}
            size="xs"
            variant="ghost"
          />
        ) : (
          <div className="pl-1.5">
            <SearchIcon />
          </div>
        )}
      </div>

      {enableSearchNotes && (
        <div className="absolute right-0 h-full flex items-stretch">
          <Popover
            Description='Search "Notes" field'
            Trigger={() => {
              return (
                <div
                  className={twJoin(
                    'px-2 h-full flex items-center cursor-pointer',
                    searchNotes ? 'text-theme-link' : 'text-theme-t1',
                    'hover:text-theme-link-hover',
                  )}
                  onClick={() => {
                    onClickSearchNotes(!searchNotes);
                  }}
                >
                  <NotesIcon />
                </div>
              );
            }}
          />
        </div>
      )}

      <InputField
        className="size-full"
        inputClassName="size-full pl-10 pr-12"
        name="_search"
        onValueChange={handleChange}
        placeholder="Search..."
        type="text"
        value={query}
      />
    </div>
  );
};
