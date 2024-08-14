import React, { createContext, useState, useEffect, useContext } from 'react';
import { getTokens, deleteAllSecureData, deleteUserInfo } from '../../utils/authFunc';

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
        return { isSuccess: false };
      }
      const deleteUserInfoResult = await deleteUserInfo();
      if (!deleteUserInfoResult.isSuccess) {
        console.error('Failed to delete user info');
        return { isSuccess: false };
      }
      setIsLoggedIn(false);
      return { isSuccess: true };
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