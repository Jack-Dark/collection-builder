import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';

import { Button } from '#/components/Button';
import { InputField } from '#/components/Fields/InputField';
import { SwitchField } from '#/components/Fields/SwitchField';

import type { SearchProps } from './Search.types';

export const Search = (props: SearchProps) => {
  const {
    enableSearchNotes,
    onChange,
    onClickSearchNotes,
    searchNotes,
    value,
  } = props;

  const [text, setText] = useState(value);

  const handleChange = (value: string) => {
    setText(value);
    onChange(value);
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
        <SwitchField
          checked={searchNotes}
          className="absolute right-0 h-full py-1 pl-1 pr-2 flex items-stretch"
          label="Search Notes"
          onCheckedChange={onClickSearchNotes}
        />
      )}

      <InputField
        className="size-full"
        inputClassName="size-full pl-10 pr-38"
        name="_search"
        onValueChange={handleChange}
        placeholder="Search..."
        type="text"
        value={text}
      />
    </div>
  );
};
