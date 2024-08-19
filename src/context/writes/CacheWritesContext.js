import React, { createContext, useState, useContext } from 'react';

const CacheWritesContext = createContext();

export const CacheWritesProvider = ({ children }) => {
  const [ cacheWrites, setCacheWrites ] = useState({
    free: {page: 1, notices: [], writes: []},
    notice: {page: 1, notices: [], writes: []},
    gallery: {page: 1, notices: [], writes: []},
    qa: {page: 1, notices: [], writes: []},
  });

  return (
    <CacheWritesContext.Provider value={{ cacheWrites, setCacheWrites }}>
      {children}
    </CacheWritesContext.Provider>
  );
};

export const useCacheWrites = () => useContext(CacheWritesContext);