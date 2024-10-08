import React, { createContext, useState, useContext } from 'react';

const BoardsContext = createContext();

export const BoardsProvider = ({ children }) => {
  const [ boardsConfig, setBoardsConfig ] = useState({
    free: null,
    notice: null,
    gallery: null,
    qa: null,
  });

  const value = {
    boardsConfig,
    setBoardsConfig,
  };

  return (
    <BoardsContext.Provider value={value}>
      {children}
    </BoardsContext.Provider>
  );
}

export const useBoards = () => useContext(BoardsContext);