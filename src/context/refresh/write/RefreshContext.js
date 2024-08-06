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