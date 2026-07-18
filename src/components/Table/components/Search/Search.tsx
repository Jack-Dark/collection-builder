import type { ChangeEventHandler } from 'react';

import _ from 'lodash';
import { useMemo, useState } from 'react';

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
    <input
      className="input w-full"
      onChange={handleChange}
      placeholder="Search name..."
      type="text"
      value={text}
    />
  );
};
