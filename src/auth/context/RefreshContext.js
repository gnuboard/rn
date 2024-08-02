import React, { createContext, useState, useContext } from 'react';

const RefreshContext = createContext();

export const RefreshProvider = ({ children }) => {
  const [refreshing, setRefreshing] = useState(false);
  return (
    <RefreshContext.Provider value={{ refreshing, setRefreshing }}>
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefresh = () => useContext(RefreshContext);