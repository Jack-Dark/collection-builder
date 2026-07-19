import type { ChangeEventHandler } from 'react';

import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import _ from 'lodash';
import { useMemo, useState } from 'react';

import { Button } from '#/components/Button';
import { SwitchField } from '#/components/Fields/SwitchField';

import type { SearchProps } from './Search.types';

export const Search = (props: SearchProps) => {
  const { onClickSearchNotes, onValueChange, searchNotes, value } = props;

  const [text, setText] = useState(value);

  const debouncedSearch = useMemo(() => {
    return _.debounce((value) => {
      onValueChange(value);
    }, 300);
  }, []);

  const handleChange: ChangeEventHandler<HTMLInputElement, HTMLInputElement> = (
    e,
  ) => {
    const value = e.target.value;
    setText(value);
    debouncedSearch(value);
  };

  return (
    <div className="relative">
      <div className="absolute left-0 h-full p-1 flex items-center">
        {text ? (
          <Button
            className="pointer text-inherit hover:text-primary-800"
            Icon={ClearIcon}
            onClick={() => {
              setText('');
              onValueChange('');
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

      <SwitchField
        checked={searchNotes}
        className="absolute right-0 h-full py-1 pl-1 pr-2 flex items-stretch"
        label="Search Notes"
        onCheckedChange={onClickSearchNotes}
      />

      <input
        className="input size-full pl-10 pr-38"
        name="_search"
        onChange={handleChange}
        placeholder="Search..."
        type="text"
        value={text}
      />
    </div>
  );
};
