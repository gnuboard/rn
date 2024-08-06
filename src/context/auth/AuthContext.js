import React, { createContext, useState, useEffect, useContext } from 'react';
import { getTokens, deleteAllSecureData } from '../../utils/authFunc';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLoginStatus();
  }, [isLoggedIn]);

  const checkLoginStatus = async () => {
    try {
      const tokens = await getTokens();
      if (tokens) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const deleteResult =  await deleteAllSecureData();
      if (!deleteResult.isSuccess) {
        console.error('Failed to delete secure data');
        return;
      }
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isLoggedIn,
        loading,
        logout,
        setIsLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);