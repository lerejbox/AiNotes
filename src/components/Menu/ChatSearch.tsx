import React, { useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash';
import useStore from '@store/store';

import SearchBar from '@components/SearchBar';
import FilterColor from '@components/FilterColor';
import useHideOnOutsideClick from '@hooks/useHideOnOutsideClick';

const ChatSearch = ({ filter, setFilter }: { filter: string; setFilter: React.Dispatch<React.SetStateAction<string>>; }) => {
  const [_filter, _setFilter] = useState<string>(filter);
  const generating = useStore((state) => state.generating);
  const [showPalette, setShowPalette, paletteRef] = useHideOnOutsideClick();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    _setFilter(e.target.value);
  };

  const debouncedUpdateFilter = useRef(
    debounce((f) => {
      setFilter(f);
    }, 500)
  ).current;

  useEffect(() => {
    debouncedUpdateFilter(_filter);
  }, [_filter]);

  return (
    <div className="flex items-center">
      <div className="flex-grow mr-[-2]">
      <SearchBar
        value={_filter}
        handleChange={handleChange}
        className='h-8 mb-2'
        disabled={generating}
      />
      </div>
      <div 
      className={`flex py-1 px-2 rounded-xl hover:new-lightblue transition-colors duration-200 text-white text-sm mb-2 border border-white/20 ${
        generating
          ? 'cursor-not-allowed opacity-40'
          : 'cursor-pointer opacity-100'
      }`}
      >
        <FilterColor/>
      </div>
    </div>
  );
  
};

export default ChatSearch;

