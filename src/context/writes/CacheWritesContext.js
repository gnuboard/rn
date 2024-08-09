import React, { createContext, useState, useContext } from 'react';

const CacheWritesContext = createContext();

export const CacheWritesProvider = ({ children }) => {
  const [ loadCacheWrites, setLoadCacheWrites ] = useState(false);
  const [ cacheWrites, setCacheWrites ] = useState({
    free: {page: 1, posts: []},
    notice: {page: 1, posts: []},
    gallery: {page: 1, posts: []},
    qa: {page: 1, posts: []},
  });

  return (
    <CacheWritesContext.Provider value={{ loadCacheWrites, setLoadCacheWrites, cacheWrites, setCacheWrites }}>
      {children}
    </CacheWritesContext.Provider>
  );
};

export const useCacheWrites = () => useContext(CacheWritesContext);