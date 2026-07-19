import type { ChangeEventHandler } from 'react';

import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import _ from 'lodash';
import { useMemo, useState } from 'react';

import { Button } from '#/components/Button';

import type { SearchProps } from './Search.types';

export const Search = (props: SearchProps) => {
  const { onValueChange, value } = props;

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
      <div className="absolute h-full p-1 flex items-center">
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
      <input
        className="input size-full pl-10"
        onChange={handleChange}
        placeholder="Search name..."
        type="text"
        value={text}
      />
    </div>
  );
};
