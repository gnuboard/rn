import React, { createContext, useState, useContext } from 'react';
import { useCacheWrites } from './CacheWritesContext';

// 개별 글에 대한 context
const WriteRefreshContext = createContext();

export const WriteRefreshProvider = ({ children }) => {
  const [ writeRefresh, setWriteRefresh ] = useState(false);
  return (
    <WriteRefreshContext.Provider value={{ writeRefresh, setWriteRefresh }}>
      {children}
    </WriteRefreshContext.Provider>
  );
};

export const useWriteRefresh = () => useContext(WriteRefreshContext);


// 게시글 목록에 대한 context
const WriteListRefreshContext = createContext();

export const WriteListRefreshProvider = ({ children }) => {
  const [ writeListRefresh, setWriteListRefresh ] = useState(false);
  const { setCacheWrites } = useCacheWrites();

  async function refreshWriteList(bo_table) {
    setCacheWrites(prevCacheWrites => ({
      ...prevCacheWrites,
      [bo_table]: {
        page: 1,
        writes: [],
      }
    }));
    setWriteListRefresh(true);
  }

  return (
    <WriteListRefreshContext.Provider value={{ writeListRefresh, setWriteListRefresh, refreshWriteList }}>
      {children}
    </WriteListRefreshContext.Provider>
  );
};

export const useWriteListRefresh = () => useContext(WriteListRefreshContext);