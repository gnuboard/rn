import React, { createContext, useState, useContext } from 'react';

const SearchWritesContext = createContext();

export const SearchWritesProvider = ({ children }) => {
  const [ isSearchInputActive, setIsSearchInputActive ] = useState(false);
  const [ searchedWrites, setSearchedWrites ] = useState({});
  const value = {
    isSearchInputActive,
    setIsSearchInputActive,
    searchedWrites,
    setSearchedWrites,
  };
  return (
    <SearchWritesContext.Provider value={value}>
      {children}
    </SearchWritesContext.Provider>
  );
}

export const useSearchWrites = () => useContext(SearchWritesContext);