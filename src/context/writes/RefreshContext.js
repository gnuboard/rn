import React, { createContext, useState, useContext } from 'react';

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
  return (
    <WriteListRefreshContext.Provider value={{ writeListRefresh, setWriteListRefresh }}>
      {children}
    </WriteListRefreshContext.Provider>
  );
};

export const useWriteListRefresh = () => useContext(WriteListRefreshContext);