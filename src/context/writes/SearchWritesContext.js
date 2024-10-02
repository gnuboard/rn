import React, { createContext, useState, useContext } from 'react';

const SearchWritesContext = createContext();

export const SearchWritesProvider = ({ children }) => {
  const [ isSearchInputActive, setIsSearchInputActive ] = useState(false);
  const [ searchingData, setSearchingData ] = useState({
    onetable: '',
    page: 1,
    per_page: 10,
    stx: '',
  });
  const [ searchedWrites, setSearchedWrites ] = useState({});
  const value = {
    isSearchInputActive,
    setIsSearchInputActive,
    searchedWrites,
    setSearchedWrites,
    searchingData,
    setSearchingData,
  };
  return (
    <SearchWritesContext.Provider value={value}>
      {children}
    </SearchWritesContext.Provider>
  );
}

export const useSearchWrites = () => useContext(SearchWritesContext);